const { read } = require("fs");
const { start } = require("repl");
const utils = require('./utils.cjs');
const { get } = require("http");

function init(wsServer, path) {
    const
        app = wsServer.app,
        registry = wsServer.users,
        EventEmitter = require("events"),
        //utils = require('./utils.cjs'),
        channel = "citadels",
        //testMode = process.argv[2] === "debug";
        testMode = false

    app.use("/nechto", wsServer.static(`${__dirname}/dist`));
    registry.handleAppPage(path, `${__dirname}/dist/index.html`, `${__dirname}/dist/manifest.json`, '/nechto/');

    class GameState extends wsServer.users.RoomState {
        constructor(hostId, hostData, userRegistry, registry) {
            super(hostId, hostData, userRegistry, registry.games.citadels.id, path);
            let interval
            const room = {
                ...this.room,
                inited: true,
                hostId: hostId,
                playerSlots: Array(12).fill(null),
                playerNames: {},
                onlinePlayers: new JSONSet(),
                spectators: new JSONSet(),
                teamsLocked: false,
                phase: 0,
                currentPlayer: null,
                targetSlot: null,
                invertDirection: false, //true - right, false - left
                startWithNechto: false,
                currentPanika: null,
                action: null,
                karantin: {},
                time: 20,
                timed: true,
                readyPlayers: {},
                target: null,
                dveri: [],
                showAllHand: null,
                allReadyNedeed: false,
                gameLog: [],
                smallTimer: 20,
                bigTimer: 60,
                isObmenReady: false,
                voting: false,
                currentCardPanik: null,
                fullTimer: 0,
                waitMoveSlot: null,
                startSlotColor: {},
                playerAvatars: {},
                normSosed: null,
                normPlayer: null
            };
            if (testMode)
                [1, 2, 3, 4].forEach((_, ind) => {
                    room.playerSlots[ind] = `kek${ind}`;
                    room.playerNames[`kek${ind}`] = `kek${ind}`;
                });
            this.room = room;
            this.lastInteraction = new Date();
            const state = {
                zarajennie: [],
                deck: [],
                discard: [],
                playerHand: {},
                nechto: null,
                obmenCardIndex: null,
                showCard: [],
                uporstvoCards: {},
                tsepnayaReaksiaObmenKard: {}
            };
            this.state = state;
            const
                send = (target, event, data) => userRegistry.send(target, event, data),
                update = () => send(room.onlinePlayers, "state", {
                    ...room, discardSize: state.discard.length, deckSize: state.deck.length,
                    umerSlots: Object.keys(room.playerSlots).filter(i => !state.playerHand[i] && room.playerSlots[i] !== null)
                }),
                updatePlayerState = (user) => {
                    const slot = room.playerSlots.indexOf(user);
                    //TODO: knets igri
                    if (room.phase === 0) {
                        send(user, "player-state", {
                            nechto: state.nechto, zarajennie: state.zarajennie,
                            cards: null, chekCards: null
                        });
                    } else if (room.playerSlots.includes(user)) {
                        if (state.nechto === slot)
                            send(user, "player-state", {
                                nechto: state.nechto, zarajennie: state.zarajennie,
                                cards: state.playerHand[slot] ? state.playerHand[slot] : null,
                                chekCards: state.showCard[slot] ? state.showCard[slot] : null
                            });
                        else if (state.zarajennie.includes(slot))
                            send(user, "player-state", {
                                cards: state.playerHand[slot], nechto: state.nechto,
                                chekCards: state.showCard[slot] ? state.showCard[slot] : null,
                                zarajennie: [slot]
                            });
                        else
                            send(user, "player-state", {
                                cards: state.playerHand[slot],
                                chekCards: state.showCard[slot] ? state.showCard[slot] : null
                            });
                    } else {
                        send(user, "player-state", {});
                    }
                },
                updateState = () => [...room.onlinePlayers].forEach(updatePlayerState),
                getNextPlayer = (invert, slot) => {
                    slot = slot ?? room.currentPlayer;
                    if (!invert) {
                        slot++;
                        while (!state.playerHand[slot]) {
                            if (slot > 11)
                                slot = 0;
                            else
                                slot++;
                        }
                        return slot;
                    } else {
                        slot--;
                        while (!state.playerHand[slot]) {
                            if (slot < 0)
                                slot = 11;
                            else
                                slot--;
                        }
                        return slot;
                    }
                },
                getThirdPlayers = (ind) => {
                    let slot = room.currentPlayer;
                    let i = 0;
                    while (i < ind) {
                        do {
                            slot++;
                            if (slot > 11) {
                                slot = 0;
                            }
                        } while (!state.playerHand[slot]);
                        i++;
                    }
                    let slotA = room.currentPlayer;
                    let o = 0;
                    while (o < ind) {
                        do {
                            slotA--;
                            if (slotA < 0) {
                                slotA = 11;
                            }
                        } while (!state.playerHand[slotA]);
                        o++;
                    }

                    return [slot, slotA]
                },
                startGame = () => {
                    state.playersCount = room.playerSlots.filter((user) => user !== null).length;
                    if (state.playersCount > 3) {
                        room.playerHand = {};
                        room.teamsLocked = true;
                        room.currentPanika = null;
                        room.currentPlayer = shuffleArray(room.playerSlots.map((it, index) => index).filter(inx => room.playerSlots[inx]))[0]
                        state.zarajennie = [];
                        //room.currentPlayer = 4
                        room.gameLog = [];
                        state.showCard = {};
                        state.discard = [];
                        room.gameLog.push({ action: 'start-game' })
                        state.nechto = null;
                        room.action = null;
                        state.obmenCardIndex = null
                        room.karantin = {};
                        room.dveri = [];
                        room.currentCardPanik = null
                        room.showAllHand = null
                        state.deck = utils.createDeck(state.playersCount, room.startWithNechto);
                        if (room.winnerPlayer != null)
                            utils.shuffle(room.playerSlots);
                        room.playerSlots.forEach((player, slot) => {
                            if (player !== null) {
                                state.playerHand[slot] = state.deck.splice(0, 4);
                            } else {
                                delete state.playerHand[slot]
                            }
                        });
                        room.playerSlots.forEach((player, slot) => {
                            room.startSlotColor[player] = slot
                        });
                        startRound();
                    }
                },
                startRound = () => {
                    room.phase = 1; // чел фоткает стол и  взять карту
                    state.uporstvoCards = {};
                    state.showCard = {};
                    state.tsepnayaReaksiaObmenKard = {}
                    room.currentCardPanik = null
                    room.waitMoveSlot = room.currentPlayer
                    room.gameLog.push({ action: 'start-round', actors: [room.playerSlots[room.currentPlayer]] })
                    //findNormPlayers()
                    startTimer();
                    update();
                    updateState();
                },
                // findNormPlayers = () => {
                //     room.normSosed = [] //TODO: norm soseda bi sdelat
                //     room.normPlayer[room.currentPlayer] = [] //TODO: norm playera bi sdelat
                // },
                startTimer = () => {
                    if (room.timed) {
                        clearInterval(interval);
                        if (room.phase === 0)
                            return
                        if (room.phase === 1)
                            room.time = room.smallTimer * 1000;
                        else if (room.phase === 2) {
                            if (!room.voting) {
                                //TODO: all piniks nije
                                if ([].includes(room.currentPanika)) {
                                    room.time = room.smallTimer * 1000;
                                } else
                                    room.time = room.bigTimer * 1000;
                            } else {

                            }

                        }
                        else if (room.phase === 3)
                            room.time = room.smallTimer * 1000;
                        let time = new Date();
                        interval = setInterval(() => {
                            if (!room.paused) {
                                room.time -= new Date() - time;
                                time = new Date();
                                if (room.time <= 0) {
                                    clearInterval(interval);
                                    resolvePassAction()
                                };
                            }
                        }, 100);
                        room.fullTimer = room.time
                        update()
                    }
                },
                resolvePassAction = () => {
                    const getRandomObmenCard = (slot) => {
                        if (slot === state.nechto) {
                            const cards = state.playerHand[slot].filter(i => i.id !== 'nechto')
                            return state.playerHand[slot].indexOf(shuffleArray(cards)[0])
                        } else {
                            const cards = state.playerHand[slot].filter(i => i.id !== 'nechto' && i.id !== 'zarajenie')
                            return state.playerHand[slot].indexOf(shuffleArray(cards)[0]);
                        }
                    }
                    if (room.phase === 1) {
                        grabCard()
                    }
                    if (room.phase === 3) {
                        if (!state.obmenCardIndex) {
                            state.obmenCardIndex = getRandomObmenCard(room.currentPlayer)
                            room.isObmenReady = true
                            startTimer()
                        }
                        else if (state.obmenCardIndex) {
                            obmenProcces(getRandomObmenCard(room.target))
                        }
                    };
                    if (room.action) {
                        const logi = (chel, act) => room.gameLog.push({ actors: chel, result: act })
                        if (room.action === 'ognemet') {
                            playerKill(room.target)
                            logi(room.currentPlayer)
                            startObmen()
                        } else if (room.action === 'soblazn') {
                            obmenProcces(getRandomObmenCard(room.target))
                            endRound()
                        } else if (room.action === 'analiz') {
                            state.showCard = {}
                            startObmen()
                        } else if (room.action === 'podozrenie') {
                            state.showCard = {}
                            startObmen()
                        } else if (room.action === 'menyaemsyaMestami' || room.action === 'smaivayUdochki') {
                            cardMneIZdesNeploha()
                            startObmen();
                        } else if (room.action == 'strah') {
                            state.showCard = {}
                            endRound()
                        } else if (room.action == 'uporstvo') {
                            let nechtoIndex = state.uporstvoCards.findIndex(c => c.id === 'nechto')
                            if (nechtoIndex == -1) {
                                let index = shuffleArray([1, 2, 3])[0]
                                state.playerHand[room.currentPlayer].push(...state.uporstvoCards.splice(index, 1))
                                state.discard.push(...state.uporstvoCards)
                            } else if (nechtoIndex === 0 || nechtoIndex) {
                                let index = nechtoIndex
                                state.nechto = room.currentPlayer
                                state.playerHand[room.currentPlayer].push(...state.uporstvoCards.splice(index, 1))
                                state.discard.push(...state.uporstvoCards)
                            } else {
                                return false
                            }
                            room.action = null;
                            state.showCard = {}
                            isDead(room.currentPlayer)
                            room.action = null
                            startTimer()
                            update()
                            updateState()
                        }
                        if (room.currentPanika !== null) {
                            if (room.currentPanika === 'tsepnayaReaksia') {
                                Object.Keys(state.playerHand).forEach(slot => {
                                    if (!room.readyPlayers[slot]) {
                                        state.tsepnayaReaksiaObmenKard[slot] = getRandomObmenCard(slot)
                                    }
                                });
                                startTsepnayaReaksia()
                            } else if (room.currentPanika.id === 'tolkoMejduNami') {
                                const sosedi = [getNextPlayer(true), getNextPlayer(false)]
                                tolkoMejduNamiPanika(sosedi[shuffleArray([0, 1])], room.currentPlayer)
                            } else if (room.currentPanika.id === 'razDva') {
                                if (!room.target) {
                                    if (room.karantin[getThirdPlayers()[0]])
                                        room.target = getThirdPlayers()
                                    else if (room.karantin[getThirdPlayers()[1]])
                                        room.target = getThirdPlayers()
                                    else startObmen()
                                }
                                smenaMest(room.target, room.currentPlayer)
                                room.currentPanika = null
                                startObmen()
                            } else if (room.currentPanika.id === 'iViEtoNazivaeteVecherinkoy') {
                                iViEtoNazivaeteVecherinkoyPanika()
                                PanikaiViEtoNazivaeteVecherinkoy()
                                room.currentPanika = null
                                startObmen()
                            } else if (room.currentPanika.id === 'davaiDrujit') {
                                if (!state.obmenCardIndex) {
                                    state.obmenCardIndex = getRandomObmenCard(room.currentPlayer)
                                    const canBeTarget = [
                                        getNextPlayer(room.invertDirection, room.currentPlayer),
                                        getNextPlayer(!room.invertDirection, room.currentPlayer)
                                    ].filter(el => !room.karantin.includes(el) && !chekSosedaNaPidora(el)) //FIXME:room.karantin.includes is not a function 
                                    if (canBeTarget) {
                                        room.target = shuffleArray(canBeTarget)[0]
                                        update()
                                    }
                                    else startObmen()
                                }
                                else if (state.obmenCardIndex) {
                                    obmenProcces(getRandomObmenCard(room.target))
                                }
                            } else if (room.currentPanika.id === 'svidanieVSlepuyu') {
                                svidanieVSlepuyuPanika(room.currentPlayer, getRandomObmenCard(room.currentPlayer))
                            } else if (room.currentPanika.id === "ubiraysyaProchPanika") {
                                tsel = shuffleArray(Object.Keys(state.playerHand))
                                ubiraysyaProchPanika(tsel, room.currentPlayer)
                            } else if (room.currentCardPanika.id === "zabivchivost") {
                                zabivchevostChekCard(room.currentPlayer)
                            }
                        }
                    }
                    if (room.phase === 2 && !room.currentPanika) {
                        const card = getRandomObmenCard(room.currentPlayer)
                        const cardInd = state.playerHand[room.currentPlayer].indexOf(card)
                        state.discard.push(state.playerHand[room.currentPlayer].splice(cardInd, 1));
                        room.gameLog.push({ action: 'drop-card', actors: [room.playerSlots[room.currentPlayer]] })
                        update()
                        updateState()
                        startObmen()
                    }
                },
                startTsepnayaReaksia = () => {
                    Object.Keys(state.tsepnayaReaksiaObmenKard).forEach(slot => {
                        let karta1 = state.playerHand[slot][state.tsepnayaReaksiaObmenKard[slot]];
                        const nextPlayer = getNextPlayer(room.invertDirection)
                        if (karta1.type === 'zarajenie' && slot !== state.nechto && !state.zarajennie.has(nextPlayer)) {
                            state.zarajennie.push(nextPlayer)
                        }
                        state.playerHand[nextPlayer].push(karta1)
                        state.playerHand[slot].splice(state.tsepnayaReaksiaObmenKard[slot], 1)
                        isDead(nextPlayer)
                    });
                    room.currentPanika = null
                    endRound()
                },
                // panikaTsepnayaReaksia = () => {
                //     state.tsepnayaReaksiaObmenKard[getNextPlayer(room.invertDirection, slot)] = state.playerHand[slot][index];
                //     state.playerHand[slot].splice(index, 1)
                //     if (state.playerHand.length === state.tsepnayaReaksiaObmenKard.length)
                //         panikaTsepnayaReaksiaDva()
                // },
                cardMneIZdesNeploha = () => {
                    smenaMest(room.currentPlayer, room.target)
                },
                PanikaiViEtoNazivaeteVecherinkoy = () => {
                    let kolvoSmen = Math.floor(Object.keys(state.playerHand).length / 2)
                    let firstChel = room.currentPlayer
                    let vtoroyChel = getNextPlayer(room.invertDirection, firstChel)
                    while (kolvoSmen--) {
                        smenaMest(firstChel, vtoroyChel)
                        firstChel = getNextPlayer(room.invertDirection, vtoroyChel)
                        vtoroyChel = getNextPlayer(room.invertDirection, firstChel)
                    }
                    update()
                    updateState()
                },
                isDead = (player) => {
                    let zarCount = 0
                    state.playerHand[player].forEach(el => {
                        if (el.id === 'zarajenie')
                            zarCount++
                    });
                    if (zarCount >= 3)
                        playerKill(player)
                },
                playerKill = (target) => {
                    state.discard.push(room.playerHand[target]);
                    delete state.playerHand[target]
                    if (room.dveri.includes(target)) {
                        room.dveri.splice(room.dveri.indexOf(target), 1)
                        const prevPLayer = getNextPlayer(true, target)
                        if (!room.dveri.includes(prevPLayer)) {
                            room.dveri.push(prevPLayer)
                        }
                    }
                    if (target === state.nechto) {
                        isGameEnd(target)
                    }
                },
                isGameEnd = (k) => {
                    if (state.zarajennie.length + 1 === Object.keys(state.playerHand).length) {
                        endGame()
                    } else if (k == state.nechto)
                        endGame()
                },
                reshuffle = () => {
                    if (state.deck.length === 0) {
                        state.deck = [...state.discard]
                        shuffleArray(state.deck)
                        state.discard = []
                    }
                },
                smenaMest = (slot1, slot2) => {
                    if (room.currentPlayer === slot1)
                        room.currentPlayer = slot2
                    else if (room.currentPlayer === slot2)
                        room.currentPlayer = slot1
                    if (room.target === slot1)
                        room.target = slot2
                    else if (room.target === slot2)
                        room.target = slot1
                    if (slot1 === state.nechto) {
                        state.nechto = slot2
                    } else if (slot2 === state.nechto) {
                        state.nechto = slot1
                    }
                    if (state.zarajennie.includes(slot1)) {
                        state.zarajennie.splice(indexOf(slot1), 1)
                        state.zarajennie.push(slot2)
                    }
                    if (state.zarajennie.includes(slot2)) {
                        state.zarajennie.splice(indexOf(slot2), 1)
                        state.zarajennie.push(slot1)
                    }
                    let chel1 = room.playerSlots[slot1];
                    let chel2 = room.playerSlots[slot2];
                    room.playerSlots[slot1] = chel2;
                    room.playerSlots[slot2] = chel1;
                    let ruka1 = state.playerHand[slot1];
                    let ruka2 = state.playerHand[slot2];
                    state.playerHand[slot1] = ruka2;
                    state.playerHand[slot2] = ruka1;
                },
                grabCard = () => {
                    room.phase = 2; // разыгрывание карты или паники
                    if (room.karantin[room.currentPlayer])
                        room.karantin[room.currentPlayer]--
                    room.gameLog.push({ action: 'grab-card', actors: [room.playerSlots[room.currentPlayer]] })
                    const card = state.deck.shift();
                    //TODO: карантинный долбаеб же панику брат ьможет
                    reshuffle()
                    if (card.type == 'panika') {
                        room.currentPanika = card;
                        room.allReadyNedeed = card.allReady;
                        room.action = card.id;
                        room.gameLog.push({ card: card, panika: true })
                        room.currentCardPanik = card
                    } else {
                        state.playerHand[room.currentPlayer].push(card)
                        if (card.type === 'nechto') {
                            state.nechto = state.playerHand[slot]
                        }
                    };
                    startTimer()
                    update()
                    updateState()
                },
                grabNewCard = (player) => {
                    state.playerHand[player].push(dealNewCard())
                },
                dealNewCard = () => {
                    let card = state.deck.shift();
                    reshuffle()
                    while (card.type === 'panika') {
                        state.discard.push(card)
                        card = state.deck.shift();
                        reshuffle()
                    }
                    return card
                },
                startObmen = () => {
                    room.phase = 3; // фаза обмена
                    room.target = getNextPlayer(room.invertDirection)
                    startTimer()
                    update()
                    updateState()
                },
                endRound = () => {
                    const players = Object.keys(state.playerHand)
                    players.forEach(el => {
                        isDead(Number(el))
                    });
                    room.currentPlayer = getNextPlayer(room.invertDirection);
                    room.currentPanika = null;
                    room.action = null;
                    room.target = null;
                    state.obmenCardIndex = null
                    room.isObmenReady = false;
                    updatePlayerState()
                    update()
                    startRound();
                },
                endGame = () => {
                    room.currentPlayer = null;
                    room.phase = 0;
                    room.teamsLocked = false;
                    room.currentPanika = null;
                    room.action = null;
                    room.target = null;
                    room.isObmenReady = false;
                    state.nechto = null;
                    state.zarajennie = [];
                    state.uporstvoCards = {};
                    room.gameLog.push({ action: 'end-game' })
                    update();
                    updateState();
                },
                removePlayer = (playerId) => {
                    if (room.spectators.has(playerId)) {
                        this.emit("user-kicked", playerId);
                        room.spectators.delete(playerId);
                    } else {
                        room.playerSlots[room.playerSlots.indexOf(playerId)] = null;
                        if (room.onlinePlayers.has(playerId)) {
                            room.spectators.add(playerId);
                            updatePlayerState();
                        }
                    }
                },
                userJoin = (data) => {
                    const user = data.userId;
                    if (!room.playerNames[user])
                        room.spectators.add(user);
                    room.onlinePlayers.add(user);
                    room.playerNames[user] = data.userName.substr && data.userName.substr(0, 60);
                    update();
                    updateState()
                },
                userLeft = (user) => {
                    room.onlinePlayers.delete(user);
                    if (room.spectators.has(user))
                        delete room.playerNames[user];
                    room.spectators.delete(user);
                    update();
                },
                // panikaTsepnayaReaksiaDva = () => {
                //     while (state.tsepnayaReaksiaObmenKard.length > 0) {
                //         //todo: how

                //     }
                // },
                userEvent = (user, event, data) => {
                    this.lastInteraction = new Date();
                    try {
                        if (this.userEventHandlers[event])
                            this.userEventHandlers[event](user, data[0], data[1], data[2], data[3]);
                        else if (this.slotEventHandlers[event] && ~room.playerSlots.indexOf(user))
                            this.slotEventHandlers[event](room.playerSlots.indexOf(user), data[0], data[1], data[2], data[3], data[4]);
                    } catch (error) {
                        console.error(error);
                        registry.log(error.message);
                    }
                },
                chekDropCard = (slot, index) => {
                    const card = state.playerHand[slot][index];
                    const zarajenieRuki = state.playerHand[slot].filter(card => card.id === 'zarajenie').length
                    if (card.id === 'nechto') return false
                    else if (!state.zarajennie.includes(slot) || zarajenieRuki >= 2) return true
                },
                obmenChekZarajeniy = (slot, index) => {
                    if (getHandCard(slot, index).id !== 'zarajenie' && getHandCard(slot, index).id !== 'nechto') {
                        return true
                    } else if (getHandCard(slot, index).id == 'zarajenie' && slot === state.nechto) {
                        return true
                    } else if (getHandCard(slot, index).id == 'zarajenie' && getNextPlayer(!room.invertDirection) === state.nechto) {
                        return true
                    }
                },
                getHandCard = (slot, index) => {
                    return state.playerHand[slot][index];
                },
                isAllPlayersReady = () => {
                    return Object.keys(room.readyPlayers).length === Object.keys(state.playerHand).length
                },
                obmenProcces = (i) => {
                    if (room.action !== 'soblazn')
                        room.gameLog.push({ action: 'obmen', actors: [room.playerSlots[room.currentPlayer], room.playerSlots[room.target]] })
                    let karta1 = state.playerHand[room.currentPlayer][state.obmenCardIndex];
                    let karta2 = state.playerHand[room.target][i];
                    if (karta1.id === 'zarajenie' && room.currentPlayer !== state.nechto && !state.zarajennie.has(room.currentPlayer)) {
                        state.zarajennie.push(room.currentPlayer)
                    } else if (karta2.id === 'zarajenie' && room.target !== state.nechto && !state.zarajennie.has(room.target)) {
                        state.zarajennie.push(room.target)
                    }
                    state.playerHand[room.currentPlayer][state.obmenCardIndex] = karta2;
                    state.playerHand[room.target][i] = karta1;
                    isDead(room.currentPlayer)
                    isDead(room.target)
                    endRound()
                },
                chekSosedaNaPidora = (target) => { // true kodga NE pidor (pidor bez dveri)
                    const nextPlayer = getNextPlayer(room.invertDirection), prevPLayer = getNextPlayer(!room.invertDirection);
                    return (!room.dveri.includes(prevPLayer) && prevPLayer === target) || (!room.dveri.includes(nextPlayer) && nextPlayer === target)
                },
                starieVerevkiPanika = () => {
                    delete room.karantin[room.target]
                    room.currentPanika = null
                    update()
                    startObmen()
                },
                triChetyrePanika = () => {
                    room.dveri = []
                    room.currentPanika = null
                    startObmen()
                },
                uuupsPamnika = () => {
                    room.showAllHand = state.playerHand[room.currentPlayer]
                    room.currentPanika = null
                    startObmen()
                },
                iViEtoNazivaeteVecherinkoyPanika = () => {
                    room.dveri = [];
                    room.karantin = {};
                },
                razDvaPanika = (target) => {
                    if ((target === getThirdPlayers(3)[0]) || (target === getThirdPlayers(3)[1])) {
                        room.target = target
                        resolvePassAction()
                    }
                },
                ubiraysyaProchPanika = (target, slot) => {
                    if (!room.karantin[target] && room.target !== null) {
                        smenaMest(slot, target);
                        room.currentPanika = null
                        startObmen()
                    }
                },
                tolkoMejduNamiPanika = (target, slot) => {
                    if (target === getNextPlayer(true)
                        | target === getNextPlayer(false)) {
                        state.showCard[target] = state.playerHand[slot]
                        room.currentPanika = null
                        startObmen()
                    }
                },
                davaiDrujitPanika = (target, slot, index) => {
                    //FIXME: dveri add nije
                    if (!room.karantin[target]) {
                        if (slot === room.currentPlayer && !room.isObmenReady) {
                            if (obmenChekZarajeniy(slot, index)) {
                                state.obmenCardIndex = index
                                room.isObmenReady = true
                                room.target = target //HELPME: how
                                startTimer()
                                updatePlayerState()
                                update()
                            }
                        } else if (slot === room.target) {
                            if (obmenChekZarajeniy(slot, index)) {
                                obmenProcces(index)
                                room.currentPanika = null
                                startObmen()
                            }
                        }
                    }
                },
                tsepnayaReaksiaPanika = (slot, index) => {
                    if (obmenChekZarajeniy(slot, index)) {
                        state.tsepnayaReaksiaObmenKard[slot] = index
                        room.readyPlayers[slot] = true
                        //TODO: all ready
                        if (isAllPlayersReady()) {
                            startTsepnayaReaksia()
                        }
                    }
                },
                svidanieVSlepuyuPanika = (slot, index) => {
                    const kek = state.deck.splice(0, 1)
                    state.discard.push(state.playerHand[slot][index])
                    state.playerHand[slot].splice(index, 1)
                    state.playerHand[slot].push(...kek)
                    room.currentPanika = null
                    endRound()
                },
                zabivchevostChekCard = (slot) => {
                    const ruka = [...state.playerHand[slot]]
                    const newRuka = ruka.filter(it => chekDropCard(slot, it))
                    if (newRuka.length > 3) {
                        const hui = shuffleArray(newRuka)
                        zabivchivostPanika(slot, hui[1], hui[0], hui[2])
                    }
                },
                zabivchivostPanika = (slot, index1, index2, index3) => {
                    if (slot === room.currentPlayer &&
                        [index1, index2, index3].every((ind) => ind >= 0 && ind <= 4
                            && state.playerHand[slot][ind].id !== "nechto")
                        && new Set([index1, index2, index3]).size == 3) {
                        state.discard.push(state.playerHand[slot][index1])
                        state.discard.push(state.playerHand[slot][index2])
                        state.discard.push(state.playerHand[slot][index3])
                        const sortedIndices = [index1, index2, index3].sort((a, b) => a - b);
                        state.playerHand[slot].splice(sortedIndices[2], 1)
                        state.playerHand[slot].splice(sortedIndices[1], 1)
                        state.playerHand[slot].splice(sortedIndices[0], 1)
                        state.playerHand[slot].push(dealNewCard())
                        state.playerHand[slot].push(dealNewCard())
                        state.playerHand[slot].push(dealNewCard())
                        room.currentCardPanik = null
                        room.currentPanika = null
                        update()
                        updateState()
                        startObmen()
                    }
                }
            this.userJoin = userJoin;
            this.userLeft = userLeft;
            this.userEvent = userEvent;
            this.slotEventHandlers = {
                "grab-card": (slot) => {
                    reshuffle()
                    if (room.currentPlayer === slot && room.phase === 1)
                        grabCard()
                    reshuffle()
                    update()
                    updateState()
                },
                "drop-card": (slot, index) => {
                    if (room.currentPlayer === slot && room.phase === 2 && room.action === null && index >= 0 && index <= 4) {
                        if (chekDropCard(slot, index)) {
                            state.discard.push(state.playerHand[slot].splice(index, 1));
                            room.gameLog.push({ action: 'drop-card', actors: [room.playerSlots[room.currentPlayer]] })
                            startObmen()
                        }
                        update()
                        updateState()
                    }

                },
                "play-card": (slot, index, target) => {
                    if ((room.phase === 2 || room.action) && room.currentPlayer == slot
                        && index >= 0 && index <= 4) {
                        const card = state.playerHand[slot][index];
                        const sigrat = () => {
                            state.discard.push(card);
                            state.playerHand[slot].splice(index, 1);
                        }
                        const logs = () => {
                            room.gameLog.push({ card: card, actors: [room.playerSlots[room.currentPlayer], room.target ? room.playerSlots[room.target] : null] })
                        }
                        const nextPlayer = getNextPlayer(room.invertDirection)
                        const prevPLayer = getNextPlayer(!room.invertDirection)
                        if (!room.karantin[slot]) {
                            if (card.target === 'any') {
                                if (!room.karantin[target]) {
                                    if (card.id === 'smaivayUdochki') {
                                        room.action = 'smaivayUdochki'
                                        room.target = target
                                        sigrat()
                                        logs()
                                    } else if (card.id === 'soblazn') {
                                        room.action = 'soblazn'
                                        room.target = target
                                        sigrat()
                                        logs()
                                        updateState()
                                        update()
                                    }
                                }
                            } else if (card.target === 'sosed' &&
                                (prevPLayer === target || nextPlayer === target)) {
                                if (!room.karantin[target] && chekSosedaNaPidora(target)) {
                                    if (card.id === 'ognemet') {
                                        room.action = 'ognemet'
                                        room.target = target
                                        room.waitMoveSlot = target
                                        sigrat()
                                        logs()
                                        startTimer()
                                        update()
                                        updateState()
                                    } else if (card.id === 'analiz') {
                                        room.action = 'analiz'
                                        room.target = target
                                        logs()
                                        state.showCard[room.currentPlayer] = state.playerHand[room.target]
                                        sigrat()
                                        startTimer()
                                        update()
                                        updateState()
                                    } else if (card.id === 'podozrenie') {
                                        room.action = 'podozrenie'
                                        room.target = target
                                        room.waitMoveSlot = room.currentPlayer
                                        logs()
                                        sigrat()
                                        state.showCard[room.currentPlayer] = [state.playerHand[room.target][shuffleArray([1, 2, 3, 0])[0]]]
                                        startTimer()
                                        update()
                                        updateState()
                                    } else if (card.id === 'menyaemsyaMestami') {
                                        room.action = 'menyaemsyaMestami'
                                        room.target = target
                                        room.waitMoveSlot = target
                                        sigrat()
                                        logs()
                                        startTimer()
                                        update()
                                        updateState()
                                    }
                                }
                            } else if (card.target === 'selfOrSosed' && (prevPLayer === target || nextPlayer === target || target === slot)) {
                                if (target > slot) target = slot // TOCHNO TAK NADA????
                                if (card.id === 'topor') {
                                    if (!chekSosedaNaPidora(target)) {
                                        room.dveri.splice(room.dveri.indexOf(target), 1)
                                        logs()
                                        sigrat()
                                    }
                                    else if (room.karantin[target])
                                        delete room.karantin[target]
                                    else if (target === slot && room.karantin[getNextPlayer(true, target)])
                                        delete room.karantin[getNextPlayer(true, target)]
                                    logs()
                                    sigrat()
                                } else if ((!chekSosedaNaPidora(target) || target === slot)) {
                                    if (card.id === 'zakolchennayDver' && target !== getNextPlayer(room.invertDirection)) {
                                        room.dveri.push(target)
                                        sigrat()
                                        endRound()
                                    } else if (card.id === 'karantin' && !room.karantin[target]) {
                                        room.karantin[target] = 2 // 2 turns lol
                                        sigrat()
                                        //next what to do
                                    }
                                }
                            } else {
                                if (card.id === 'uporstvo') {
                                    room.action = 'uporstvo';
                                    room.target = null
                                    logs()
                                    sigrat()
                                    state.uporstvoCards = [dealNewCard(), dealNewCard(), dealNewCard()]
                                    state.showCard[slot] = state.uporstvoCards
                                    update()
                                    updateState()
                                    startTimer()
                                } if (card.id === 'glyadiPoStoronam') {
                                    room.invertDirection = !room.invertDirection
                                    logs()
                                    sigrat()
                                    startObmen()
                                } if (card.id === 'viski') {
                                    room.showAllHand = state.playerHand[room.currentPlayer]
                                    logs()
                                    sigrat()
                                    startObmen()
                                }
                            }
                        }
                    }
                },
                "resolve-action": (slot, index) => {
                    //FIXME: soblazn target sloman 
                    const card = state.playerHand[slot][index];
                    if (index >= 0 && index < 4 && slot === room.target) {
                        const sigrat = () => {
                            state.discard.push(card);
                            state.playerHand[slot].splice(index, 1);
                            grabNewCard(room.target)
                        };
                        const logsOne = () => {
                            room.gameLog.push({ card: card, actors: [room.playerSlots[room.target]] })
                        };
                        const dieLog = () => {
                            room.gameLog.push({ actors: room.playerSlots[room.target] })
                        }
                        if (room.action === 'ognemet') {
                            if (card.id === 'nikakogoShahlika') {
                                room.waitMoveSlot = room.currentPlayer
                                logsOne()
                                sigrat()
                                startObmen()
                            };
                        } else if (room.action === 'menyaemsyaMestami' || room.action === 'smaivayUdochki') {
                            if (card.id === 'mneIZdesNePloha') {
                                room.waitMoveSlot = room.currentPlayer
                                logsOne()
                                startObmen()
                            }
                        } else if (room.phase === 3 || room.action === 'soblazn') {
                            if (card.id === 'mimo') {
                                logsOne()
                                sigrat()
                                room.target = getNextPlayer(room.invertDirection, room.target)
                                room.waitMoveSlot = room.target
                                startTimer()
                                update()
                                updateState()
                            } else if (card.id === 'strah') {
                                sigrat()
                                logsOne()
                                room.waitMoveSlot = room.currentPlayer
                                state.showCard[room.target] = [state.playerHand[room.currentPlayer][state.obmenCardIndex]]
                                room.action = 'strah'
                                room.waitMoveSlot = room.currentPlayer
                                update()
                                updateState()
                            } else if (card.id === 'netUjSpasibo') {
                                room.waitMoveSlot = room.currentPlayer
                                logsOne()
                                sigrat()
                                endRound()
                            }
                        }
                    } else if (slot === room.currentPlayer && room.action === 'soblazn') {
                        state.obmenCardIndex = index;
                        room.isObmenReady = true;
                        update()
                        updateState()
                    } else if (room.action === 'uporstvo') {
                        if (slot == room.currentPlayer && index >= 0 && index < 3) {
                            let nechtoIndex = state.uporstvoCards.findIndex(c => c.id === 'nechto')
                            if (nechtoIndex == -1) {
                                state.playerHand[slot].push(...state.uporstvoCards.splice(index, 1))
                                state.discard.push(...state.uporstvoCards)
                            }
                            else if (nechtoIndex === index) {
                                state.nechto = slot
                                state.playerHand[slot].push(...state.uporstvoCards.splice(index, 1))
                                state.discard.push(...state.uporstvoCards)
                                //room.gameLog.push({ card: card, actors: room.playerSlots[room.currentPlayer] })
                            } else {
                                return false
                            }
                            room.action = null;
                            state.showCard = {}
                            isDead(slot)
                            room.action = null
                            startTimer()
                            update()
                            updateState()
                        }
                    }

                },
                "resolve-soblazn": (slot, index) => {
                    if (slot === room.target && index >= 0 && index < 4 && room.action === 'soblazn' && room.isObmenReady && obmenChekZarajeniy(slot, index)) {
                        obmenProcces(index)
                    }
                },
                "resolve-obmen": (slot, index) => {
                    if (slot === room.target && index >= 0 && index < 4) {
                        if (room.isObmenReady && obmenChekZarajeniy(slot, index)) {
                            obmenProcces(index)
                        }
                    }
                },
                "vilojit-kartu-na-obmen": (slot, index) => {
                    if (slot === room.currentPlayer && index >= 0 && index < 4 && obmenChekZarajeniy(slot, index)) {
                        room.isObmenReady = true;
                        state.obmenCardIndex = index;
                        room.showAllHand = null
                        startTimer()
                        update()
                    }
                },
                "resolve-pass-action": (slot) => {
                    if (['podozrenie', 'analiz'].includes(room.action)) {
                        if (room.currentPlayer === slot)
                            resolvePassAction()
                    } else if (slot === room.target) {
                        resolvePassAction()
                    }
                },
                "panic-action": (slot, target, index, index1, index2, index3) => {
                    const card = room.currentPanika
                    if (room.phase == 2 && card.type === 'panika') {
                        if (card.id === 'iViEtoNazivaeteVecherinkoy') {
                            iViEtoNazivaeteVecherinkoyPanika()
                            PanikaiViEtoNazivaeteVecherinkoy()
                            room.currentPanika = null
                            startObmen()
                        } else if (card.id === 'razDva') {
                            if (target !== null)
                                razDvaPanika(target)
                        } else if (card.id === 'ubiraysyaProch') {
                            if (target !== null)
                                ubiraysyaProchPanika(target, slot)
                        } else if (card.id === 'starieVerevki') {
                            starieVerevkiPanika()
                        } else if (card.id === 'tolkoMejduNami') {
                            if (target !== null)
                                tolkoMejduNamiPanika(target, slot)
                        } else if (card.id === 'davaiDrujit') {
                            if (target !== null && index !== null && slot === room.currentPlayer)
                                davaiDrujitPanika(target, slot, index)
                            else if (slot === room.target && index !== null)
                                davaiDrujitPanika(target, slot, index)
                        } else if (card.id === 'vremyaPriznaniy') {
                            //TODO: НЕ ДЕЛАЮ ХУЙНЮ
                        } else if (card.id === 'tsepnayaReaksia') {
                            //FIXME: bug ist hier
                            tsepnayaReaksiaPanika(slot, getNextPlayer(room.invertDirection, slot))
                        } else if (card.id === 'triChetyre') {
                            triChetyrePanika()
                        } else if (card.id === 'uups') {
                            uuupsPamnika()
                        } else if (card.id === 'svidanieVSlepuyu') {
                            if (index !== null)
                                svidanieVSlepuyuPanika(slot, index)
                        } else if (card.id === 'zabivchivost') {
                            zabivchivostPanika(slot, index1, index2, index3)
                        }
                    }
                }
            };
            this.userEventHandlers = {
                ...this.eventHandlers,
                "start-game": (user) => {
                    if (user === room.hostId)
                        startGame();
                },
                "abort-game": (user) => {
                    if (user === room.hostId)
                        endGame();
                },
                "toggle-lock": (user) => {
                    if (user === room.hostId)
                        room.teamsLocked = !room.teamsLocked;
                    update();
                },
                "players-join": (user, slot) => {
                    if (!room.teamsLocked && room.playerSlots[slot] === null) {
                        if (~room.playerSlots.indexOf(user))
                            room.playerSlots[room.playerSlots.indexOf(user)] = null;
                        room.playerSlots[slot] = user;
                        room.spectators.delete(user);
                        update();
                        updatePlayerState()
                    }
                },
                "start-with-nechto": (user) => {
                    if (room.hostId === user)
                        room.startWithNechto = !room.startWithNechto
                },
                "spectators-join": (user) => {
                    if (!room.teamsLocked && ~room.playerSlots.indexOf(user)) {
                        room.playerSlots[room.playerSlots.indexOf(user)] = null;
                        room.spectators.add(user);
                        update();
                        updatePlayerState()
                    }
                },
                "remove-player": (user, playerId) => {
                    if (room.hostId === user && playerId)
                        removePlayer(playerId);
                    update();
                },
                "give-host": (user, playerId) => {
                    if (room.hostId === user && playerId) {
                        room.hostId = playerId;
                        this.emit("host-changed", user, playerId);
                    }
                    update();
                },
                "update-avatar": (user, id) => {
                    room.playerAvatars[user] = id;
                    update()
                },
                "toggle-paused": (user) => {
                    if (user === room.hostId) {
                        room.paused = !room.paused;
                        if (!room.paused && room.timeChanged) {
                            room.timeChanged = false;
                            startTimer();
                        }
                    }
                    update();
                },
                "toggle-timed": (user) => {
                    if (user === room.hostId) {
                        room.timed = !room.timed;
                        if (!room.timed) {
                            room.paused = true;
                            clearInterval(timerInterval);
                        } else {
                            if (room.phase !== "idle") {
                                room.paused = false;
                                startTimer();
                            } else room.paused = true;
                        }
                    }
                    update();
                },
            };
        }


        getPlayerCount() {
            return Object.keys(this.room.playerNames).length;
        }

        getActivePlayerCount() {
            return this.room.onlinePlayers.size;
        }

        getLastInteraction() {
            return this.lastInteraction;
        }

        getSnapshot() {
            return {
                room: this.room,
                state: this.state
            };
        }

        setSnapshot(snapshot) {
            Object.assign(this.room, snapshot.room);
            Object.assign(this.state, snapshot.state);
            this.room.onlinePlayers = new JSONSet();
            this.room.spectators = new JSONSet();
            this.room.onlinePlayers.clear();
        }
    }

    class JSONSet extends Set {
        constructor(iterable) {
            super(iterable)
        }

        toJSON() {
            return [...this]
        }
    }

    registry.createRoomManager(path, GameState);
}

module.exports = init;

function shuffleArray(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
