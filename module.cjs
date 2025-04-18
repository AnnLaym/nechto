const { read } = require("fs");
const { start } = require("repl");
const utils = require('./utils.cjs');
const { get } = require("http");
const { isNumber } = require("util");
const { pid } = require("process");
function init(wsServer, path) {
    const
        app = wsServer.app,
        registry = wsServer.users,
        EventEmitter = require("events"),
        //utils = require('./utils.cjs'),
        channel = "citadels",
        //testMode = process.argv[2] === "debug";
        testMode = true

    app.use("/nechto", wsServer.static(`${__dirname}/dist`));
    registry.handleAppPage(path, `${__dirname}/dist/index.html`, `${__dirname}/dist/manifest.json`, '/nechto/');

    class GameState extends wsServer.users.RoomState {
        constructor(hostId, hostData, userRegistry, registry) {
            super(hostId, hostData, userRegistry, registry.games.citadels.id, path);
            let interval
            let pidorstvo = false // bilo mimo = true
            let seflKarantin = false
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
                smallTimer: 15,
                bigTimer: 50,
                isObmenReady: false,
                voting: false,
                currentCardPanik: null,
                fullTimer: 0,
                waitMoveSlot: null,
                startSlotColor: {},
                playerAvatars: {},
                normSosed: null,
                normPlayer: null,
                normThirdPlayers: null,
                winner: null
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
                tsepnayaReaksiaObmenKard: {},
                umerZarajennim: []
            };
            this.state = state;
            const
                send = (target, event, data) => userRegistry.send(target, event, data),
                update = () => send(room.onlinePlayers, "state", {
                    ...room, discardSize: state.discard.length, deckSize: state.deck.length,
                    umerSlots: Object.keys(room.playerSlots)
                        .filter(i => !state.playerHand[i] && room.playerSlots[i] !== null)
                        .map((slot) => parseInt(slot)),
                    dveriClient: calcDveriClient(),
                    isNextCardPanika: CalcNextCardPanika(),
                    isPrevCardPanika: calcPrevCardPanika(),
                    // actionCard: utils.getActionCard(room.action)
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
                                chekCards: state.showCard[slot] ? state.showCard[slot] : null,
                                nechto: null, zarajennie: null
                            });
                    } else {
                        send(user, "player-state", {});
                    }
                },
                updateState = () => [...room.onlinePlayers].forEach(updatePlayerState),
                getNextPlayer = (invert, slot) => {
                    slot = slot ?? room.currentPlayer;
                    if (invert === false) { // NU I HUINYA JE TUT NAPISANA UDP: wrode fix no eshe ne testil
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
                calcDveriClient = () => {
                    const res = {}
                    for (let slot of Object.keys(state.playerHand)) {
                        res[slot] = {
                            prev: !chekSosedaNaPidora(getNextPlayer(true, slot), slot),
                            next: room.dveri.includes(parseInt(slot))
                        }
                    }
                    return res
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
                getRandomPlayer = (slot) => {
                    const chel = getNextPlayer(room.invertDirection, Math.floor(Math.random() * 12))
                    return chel == slot ? getNextPlayer(chel) : chel
                },
                startGame = () => {
                    state.playersCount = room.playerSlots.filter((user) => user !== null).length;
                    if (state.playersCount > 3) {
                        room.playerHand = {};
                        room.normSosed = null
                        room.normPlayer = null
                        room.normThirdPlayers = null
                        room.teamsLocked = true;
                        state.tsepnayaReaksiaObmenKard = {}
                        room.currentPanika = null;
                        shufflePlayerSLots()
                        room.currentPlayer = shuffleArray(room.playerSlots.map((it, index) => index).filter(inx => room.playerSlots[inx]))[0]
                        state.zarajennie = [];
                        room.isNextCardPanika = null
                        //room.currentPlayer = 4
                        room.invertDirection = (Math.floor(Math.random() * 10) + 1) % 2 !== 0
                        //room.invertDirection = false
                        room.gameLog = [];
                        state.showCard = {};
                        room.isObmenReady = false;
                        state.obmenCardIndex = null
                        state.discard = [];
                        room.winner = null
                        room.gameLog.push({ action: 'start-game', nechto: room.startWithNechto })
                        state.nechto = null;
                        room.action = null;
                        state.obmenCardIndex = null
                        room.karantin = {};
                        room.dveri = [];
                        room.currentCardPanik = null
                        room.showAllHand = null
                        state.deck = utils.createDeck(state.playersCount, room.startWithNechto);
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

                        if (room.startWithNechto) {
                            for (let slot of Object.keys(state.playerHand)) {
                                for (let card of Object.keys(state.playerHand[slot])) {
                                    if (state.playerHand[slot][card].id === 'nechto') {
                                        state.nechto = parseInt(slot)
                                    }
                                }
                            }
                        }
                        startRound();
                    }
                },
                startRound = () => {
                    room.phase = 1; // чел фоткает стол и  взять карту
                    state.uporstvoCards = {};
                    state.showCard = {};
                    room.target = null
                    room.currentCardPanik = null
                    room.waitMoveSlot = room.currentPlayer
                    room.gameLog.push({ action: 'start-round', actors: [room.playerSlots[room.currentPlayer]] })
                    state.tsepnayaReaksiaObmenKard = {}
                    room.readyPlayers = {}
                    findNormPlayers()
                    startTimer();
                    update();
                    updateState();
                },
                findNormPlayers = () => {
                    room.normSosed = []
                    room.normPlayer = []
                    room.normThirdPlayers = []
                    Object.keys(state.playerHand).forEach(player => {
                        if ((player == getNextPlayer(room.invertDirection, room.currentPlayer) ||
                            player == getNextPlayer(!room.invertDirection, room.currentPlayer))
                            && !room.karantin[player]) {
                            room.normSosed.push(parseInt(player));
                        }
                        if (player == getThirdPlayers()[1] || player == getThirdPlayers()[0]) {
                            room.normThirdPlayers.push(parseInt(player));
                        }
                        if (!room.karantin[player]) {
                            room.normPlayer.push(parseInt(player));
                        }
                    })
                    if (room.normSosed.length == 0) room.normSosed = null
                    if (room.normPlayer.length == 0) room.normPlayer = null
                    if (room.normThirdPlayers.length == 0) room.normThirdPlayers = null
                },
                startTimer = () => {
                    if (room.timed && !room.paused) {
                        clearInterval(interval);
                        if (room.phase === 0)
                            return
                        if (room.phase === 1)
                            room.time = room.smallTimer * 1000;
                        else if (room.phase === 2) {
                            //TODO: all piniks nije
                            if (['uups'].includes(room.currentPanika) || room.action === 'strah'
                                || room.action === 'viski' || (room.currentPanika && room.currentPanika.id === 'uups')) {
                                room.time = room.smallTimer * 1000;
                            } else
                                room.time = room.bigTimer * 1000;
                        }
                        else if (room.phase === 3)
                            room.time = room.bigTimer * 1000;
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
                    } else if (['uups'].includes(room.currentPanika) || room.action === 'strah'
                        || room.action === 'viski' || (room.currentPanika && room.currentPanika.id === 'uups')) {
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
                    }
                },
                resolvePassAction = () => {
                    let biloUporstvo = false
                    const getRandomObmenCard = (slot) => {
                        if (slot === state.nechto) {
                            const cardIds = state.playerHand[slot].length
                            const res = []
                            for (let i = 0; i < cardIds; i++) {
                                if (state.playerHand[slot][i].id !== 'nechto')
                                    res.push(i)
                            }
                            return shuffleArray(res)[0]
                        } else {
                            const cardIds = state.playerHand[slot].length
                            const res = []
                            for (let i = 0; i < cardIds; i++) {
                                if (state.playerHand[slot][i].id !== 'zarajenie')
                                    res.push(i)
                            }
                            return shuffleArray(res)[0]
                        }
                    }
                    if (room.phase === 1) {
                        grabCard(true)
                    } else if (room.phase === 3 && room.action !== 'strah') {
                        if (!room.isObmenReady) {
                            state.obmenCardIndex = getRandomObmenCard(room.currentPlayer)
                            room.isObmenReady = true
                            room.waitMoveSlot = room.target
                            room.target = getNextPlayer(room.invertDirection, room.currentPlayer)
                            startTimer()
                            update()
                            updatePlayerState()
                        }
                        else if (room.isObmenReady) {
                            startTimer()
                            update()
                            updatePlayerState()
                            obmenProcces(getRandomObmenCard(room.target))
                        }
                    } else if (room.action) {
                        const logi = (chel, act) => (room.gameLog.push({ actors: [room.playerSlots[chel]], action: act, bot: true }))
                        const logiX = (chel, chel2) => (room.gameLog.push({ actors: [room.playerSlots[chel], room.playerSlots[chel2]], bot: true }))
                        if (room.action === 'ognemet') {
                            playerKill(room.target)
                            logiX(room.currentPlayer, room.target)
                            room.waitMoveSlot = room.currentPlayer
                            room.target = null
                            update()
                            updatePlayerState()
                            startObmen()
                        } else if (room.action === 'soblazn') {
                            if (room.isObmenReady) {
                                obmenProcces(getRandomObmenCard(room.target), state.obmenCardIndex)
                            } else {
                                room.isObmenReady = true
                                state.obmenCardIndex = getRandomObmenCard(room.currentPlayer)
                                startTimer()
                                update()
                            }
                        } else if (room.action === 'analiz') {
                            state.showCard = {}
                            startObmen()
                        } else if (room.action === 'podozrenie') {
                            state.showCard = {}
                            startObmen()
                        } else if (room.action === 'menyaemsyaMestami' || room.action === 'smaivayUdochki') {
                            cardMneIZdesNeploha() //otmenyaet swap places
                            startObmen();
                        } else if (room.action == 'strah') {
                            state.showCard = {}
                            room.currentPlayer = getNextPlayer(room.invertDirection);
                            endRound()
                        } else if (room.action == 'viski') {
                            room.showAllHand = null
                            startObmen()
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
                            biloUporstvo = true
                            room.action = null;
                            state.showCard = {}
                            room.action = null
                            startTimer()
                            update()
                            updateState()
                        }
                        if (room.currentPanika !== null) {
                            if (room.currentPanika.id === 'tsepnayaReaksia') {
                                Object.keys(state.playerHand).forEach(slot => {
                                    if (!room.readyPlayers[slot]) {
                                        state.tsepnayaReaksiaObmenKard[slot] = getRandomObmenCard(slot)
                                    }
                                });
                                startTsepnayaReaksia()
                            } else if (room.currentPanika.id === 'tolkoMejduNami') {
                                const sosedi = [getNextPlayer(room.invertDirection), getNextPlayer(!room.invertDirection)]
                                tolkoMejduNamiPanika(sosedi[shuffleArray([0, 1])], room.currentPlayer)
                            } else if (room.currentPanika.id === 'razDva') {
                                if (!room.target) {
                                    if (!room.karantin[getThirdPlayers(3)[0]]) {
                                        room.target = getThirdPlayers(3)[0]
                                        smenaMest(room.target, room.currentPlayer)
                                        room.currentPanika = null
                                        startObmen()
                                    }
                                    else if (!room.karantin[getThirdPlayers(3)[1]]) {
                                        room.target = getThirdPlayers(3)[1]
                                        smenaMest(room.target, room.currentPlayer)
                                        room.currentPanika = null
                                        startObmen()
                                    }
                                    else {
                                        startObmen()
                                    }
                                } else if (room.target) {
                                    smenaMest(room.target, room.currentPlayer)
                                    room.currentPanika = null
                                    startObmen()
                                }
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
                                    ].filter(el => !room.karantin[el] && !chekSosedaNaPidora(el))
                                    if (canBeTarget) {
                                        room.target = shuffleArray(canBeTarget)[0]
                                        update()
                                        updatePlayerState()
                                        endRound() //ili start obmen?
                                    }
                                    else startObmen()
                                }
                                else if (state.obmenCardIndex) {
                                    obmenProcces(getRandomObmenCard(room.target))
                                }
                            } else if (room.currentPanika.id === 'svidanieVSlepuyu') {
                                if (proccesProverkaNaDolbaeba(room.currentPlayer)) {
                                    playerKill(room.currentPlayer)
                                    endRound()
                                } else {
                                    svidanieVSlepuyuPanika(room.currentPlayer, getRandomObmenCard(room.currentPlayer))
                                }
                            } else if (room.currentPanika.id === "ubiraysyaProch") {
                                room.target = getRandomPlayer(room.currentPlayer)
                                ubiraysyaProchPanika(room.target, room.currentPlayer)
                            } else if (room.currentPanika.id === "zabivchivost") {
                                zabivchevostChekCard(room.currentPlayer)
                            } else if (room.currentPanika.id === 'triChetyre') {
                                triChetyrePanika()
                            } else if (room.currentPanika.id === 'starieVerevki') {
                                starieVerevkiPanika()
                            } else if (room.currentPanika.id === 'uups') {
                                room.showAllHand = null
                                startObmen()
                            }
                        }
                    } else if (room.phase === 2 && !room.currentPanika && !biloUporstvo) {
                        const card = getRandomObmenCard(room.currentPlayer)
                        const cardInd = state.playerHand[room.currentPlayer].indexOf(card)
                        state.discard.push(...state.playerHand[room.currentPlayer].splice(cardInd, 1));
                        room.gameLog.push({ action: 'drop-card', actors: [room.playerSlots[room.currentPlayer]] })
                        update()
                        updateState()
                        startObmen()
                    }
                },
                startTsepnayaReaksia = () => {
                    room.readyPlayers = {}
                    Object.keys(state.playerHand).forEach(slot => {
                        let karta1 = state.playerHand[slot][state.tsepnayaReaksiaObmenKard[slot]];
                        const nextPlayer = getNextPlayer(room.invertDirection, slot)
                        if (karta1.type === 'zarajenie' && slot == state.nechto && !state.zarajennie.has(nextPlayer)) {
                            state.zarajennie.push(nextPlayer)
                        }
                        state.playerHand[nextPlayer].push(karta1)
                        if (karta1.id === 'zarajenie' && !state.zarajennie.includes(nextPlayer)) {
                            state.zarajennie.push(nextPlayer)
                        } // бля случайно написала то что уже написано, но не увренно что из этого работает. ОСтавлю оба
                        state.playerHand[slot].splice(state.tsepnayaReaksiaObmenKard[slot], 1)
                        isDead(nextPlayer)
                    });
                    room.currentPanika = null
                    endRound()
                },
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
                    Object.values(state.playerHand[player]).forEach(el => {
                        if (el.id === 'zarajenie')
                            zarCount++
                    });
                    if (zarCount >= 3 && state.nechto !== player) {
                        room.gameLog.push({ smetKrinj: 'smetKrinj', actors: [room.playerSlots[player]] })
                        playerKill(player)
                    }
                },
                playerKill = (target) => {
                    state.discard.push(state.playerHand[target][0]);
                    state.discard.push(state.playerHand[target][1]);
                    state.discard.push(state.playerHand[target][2]);
                    state.discard.push(state.playerHand[target][3]);
                    delete state.playerHand[target]
                    if (room.dveri.includes(target)) {
                        room.dveri.splice(room.dveri.indexOf(target), 1)
                        const prevPLayer = getNextPlayer(true, target)
                        if (!room.dveri.includes(prevPLayer)) {
                            room.dveri.push(prevPLayer)
                        }
                    }
                    if (state.zarajennie.includes(target)) {
                        state.zarajennie.splice(state.zarajennie.indexOf(target), 1)
                        state.umerZarajennim.push(target)
                    }
                    if (target === state.nechto) {
                        isGameEnd(target)
                    }
                },
                isGameEnd = (k) => {
                    if (state.zarajennie.length + 1 === Object.keys(state.playerHand).length) {
                        endGame()
                    } else if (k !== undefined && k == state.nechto)
                        endGame('nechtoZdohlo')
                },
                reshuffle = () => {
                    if (state.deck.length === 0) {
                        state.deck = [...state.discard]
                        shuffleArray(state.deck)
                        state.discard = []
                        room.gameLog.push({ action: "reshuffle" })
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
                    if (slot1 == state.nechto) {
                        state.nechto = slot2
                    } else if (slot2 == state.nechto) {
                        state.nechto = slot1
                    }
                    let nigerPidorZarajen = state.zarajennie.includes(slot2)
                    if (state.zarajennie.includes(slot1)) {
                        state.zarajennie.splice(state.zarajennie.indexOf(slot1), 1)
                        state.zarajennie.push(slot2)
                    }
                    if (nigerPidorZarajen) {
                        state.zarajennie.splice(state.zarajennie.indexOf(slot2), 1)
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
                    findNewPlayerToMove()
                },
                findNewPlayerToMove = () => {
                    switch (true) {
                        case room.phase == 3 && room.isObmenReady:
                            room.waitMoveSlot = room.target
                            break;
                        case room.phase == 3 && !room.isObmenReady:
                            room.waitMoveSlot = room.currentPlayer
                        case room.phase == 2:
                            room.waitMoveSlot = room.currentPlayer
                        default:
                            break;
                    }
                },
                grabCard = (bot) => {
                    room.phase = 2; // разыгрывание карты или паники
                    room.gameLog.push({ action: 'grab-card', actors: [room.playerSlots[room.currentPlayer]] })
                    const card = state.deck.shift();
                    //TODO: карантинный долбаеб же панику брат ьможет (исправлено, но не удалено, потому что смешное)
                    reshuffle()
                    if (card.type == 'panika') {
                        room.currentPanika = card;
                        room.allReadyNedeed = card.allReady;
                        room.action = card.id;
                        room.gameLog.push({ card: card, panika: true, bot: bot })
                        room.currentCardPanik = card
                        state.discard.push(card)
                        if (card.id === 'tsepnayaReaksia') {
                            Object.keys(state.playerHand).forEach(slot => {
                                const dolbaeb = proccesProverkaNaDolbaeba(slot)
                                if (dolbaeb) {
                                    playerKill(dolbaeb)
                                }
                            });
                        } else if (card.id == 'davaiDrujit') {
                            if (isNumber(proccesProverkaNaDolbaeba(room.currentPlayer))) {
                                playerKill(room.currentPlayer)
                                endRound()
                            }
                        }
                    } else {
                        state.playerHand[room.currentPlayer].push(card)
                        if (card.id === 'nechto') {
                            state.nechto = room.currentPlayer
                        }
                    };
                    startTimer()
                    update()
                    updateState()
                },
                CalcNextCardPanika = () => {
                    return state.deck.length > 0 ? state.deck[0].type == 'panika' : null
                },
                calcPrevCardPanika = () => {
                    return state.discard.length > 0
                        ? state.discard[state.discard.length - 1].type == 'panika' : null
                },
                isNumber = (value) => {
                    return typeof value === "number" && !Number.isNaN(value);
                },
                grabNewCard = (player) => {
                    const newCard = dealNewCard(player)
                    if (newCard.id === 'nechto') {
                        state.nechto === player
                    }
                    state.playerHand[player].push(newCard)
                },
                dealNewCard = (player) => {
                    let card = state.deck.shift();
                    reshuffle()
                    while (card.type === 'panika') {
                        state.discard.push(card)
                        card = state.deck.shift();
                        reshuffle()
                    }
                    if (card.id === 'nechto')
                        state.nechto = player
                    return card
                },
                proccesProverkaNaDolbaeba = (slot) => { //TRUE kogda dolbaeb
                    return Object.values(state.playerHand[slot]).filter(card => card.id === 'zarajenie').length >= 4 ? slot : false
                },
                startObmen = () => {
                    isGameEnd()
                    const dolbaeb = proccesProverkaNaDolbaeba(room.currentPlayer)
                    if (!isNumber(dolbaeb) && state.phase !== 0) {
                        room.phase = 3; // фаза обмена
                        room.target = getNextPlayer(room.invertDirection)
                        room.action = null
                        room.currentPanika = null
                        if (chekSosedaNaPidora(room.target)
                            && !room.karantin[room.currentPlayer]
                            && !room.karantin[room.target]) {
                            startTimer()
                            update()
                            updateState()
                        } else endRound()
                    } else {
                        playerKill(dolbaeb)
                        room.gameLog.push({
                            smertDolbaeba: 'smert-dolbaeb',
                            actors: [room.playerSlots[dolbaeb]]
                        })
                        endRound()
                    }
                },
                endRound = () => {
                    room.target = null
                    const players = Object.keys(state.playerHand)
                    players.forEach(el => {
                        isDead(Number(el))
                    });
                    if (room.karantin[room.currentPlayer] && !seflKarantin) {
                        room.karantin[room.currentPlayer]--
                        if (room.karantin[room.currentPlayer] === 0) {
                            slometKarantin()
                        }
                    }
                    room.currentPlayer = getNextPlayer(room.invertDirection)
                    room.currentPanika = null
                    room.action = null
                    state.obmenCardIndex = null
                    room.isObmenReady = false
                    room.normSosed = null
                    room.normPlayer = null
                    room.normThirdPlayers = null
                    state.tsepnayaReaksiaObmenKard = {}
                    room.readyPlayers = {}
                    seflKarantin = false
                    isGameEnd()
                    updatePlayerState()
                    update()
                    if (room.phase !== 0) {
                        startRound()
                    }
                },
                endGame = (nechtoZdohlo) => {
                    room.currentPlayer = null
                    room.phase = 0
                    room.currentPanika = null
                    room.action = null
                    room.target = null
                    room.invertDirection = false
                    room.isObmenReady = false
                    state.uporstvoCards = {}
                    if (nechtoZdohlo) {
                        room.winner = 'ebanati'
                    } else if (state.zarajennie.length === Object.keys(state.playerHand).length - 1) {
                        room.winner = 'nechto and team'
                    }
                    state.zarajennie.push(...state.umerZarajennim)
                    room.gameLog.push({ action: 'end-game' })
                    update()
                    updateState()
                },
                removePlayer = (playerId) => {
                    if (room.spectators.has(playerId)) {
                        this.emit("user-kicked", playerId)
                        room.spectators.delete(playerId)
                    } else {
                        room.playerSlots[room.playerSlots.indexOf(playerId)] = null
                        if (room.onlinePlayers.has(playerId)) {
                            room.spectators.add(playerId)
                            updatePlayerState()
                        }
                    }
                },
                userJoin = (data) => {
                    const user = data.userId;
                    if (!room.playerNames[user])
                        room.spectators.add(user)
                    room.onlinePlayers.add(user)
                    room.playerNames[user] = data.userName.substr && data.userName.substr(0, 60)
                    update()
                    updateState()
                },
                userLeft = (user) => {
                    room.onlinePlayers.delete(user)
                    if (room.spectators.has(user))
                        delete room.playerNames[user]
                    room.spectators.delete(user)
                    update()
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
                    if (card.id == 'nechto') return false
                    else if (state.nechto === slot || !state.zarajennie.includes(slot) || (zarajenieRuki >= 2 || card.id !== 'zarajenie'))
                        return true
                },
                chekDropCardCard = (slot, index) => {
                    const card = index;
                    const zarajenieRuki = state.playerHand[slot].filter(card => card.id === 'zarajenie').length
                    if (card.id == 'nechto') return false
                    else if (!state.zarajennie.includes(slot) || zarajenieRuki >= 2) return true
                },
                slomatDver = () => {
                    state.discard.push({
                        zakolchennayDver: {
                            type: "card", target: 'selfOrSosed', id: 'zakolchennayDver',
                            count: { 4: 1, 5: 1, 6: 1, 7: 2, 8: 2, 9: 2, 10: 2, 11: 3, 12: 3 }
                        }
                    })
                },
                slometKarantin = () => {
                    state.discard.push({
                        karantin: {
                            type: "card", target: 'selfOrSosed', id: 'karantin',
                            count: { 4: 0, 5: 1, 6: 1, 7: 1, 8: 1, 9: 2, 10: 2, 11: 2, 12: 2 }
                        },
                    })
                },
                obmenChekZarajeniy = (slot, index) => {
                    if (index === 1 | index === 2 | index === 3 | index === 0) {
                        let zarC = 0
                        state.playerHand[slot].forEach(el => {
                            if (el.id === 'zarajenie')
                                zarC++
                        });
                        zarC++
                        if (getHandCard(slot, index).id == 'nechto')
                            return false
                        else if (getHandCard(slot, index).id == 'zarajenie' && slot == state.nechto) {
                            return true
                        } else if (getHandCard(slot, index).id == 'zarajenie' && room.target === state.nechto
                            && state.zarajennie.includes(slot) && zarC > 1) {
                            return true
                        } else if (getHandCard(slot, index).id !== 'zarajenie')
                            return true
                    }
                },
                getHandCard = (slot, index) => {
                    return state.playerHand[slot][index];
                },
                isAllPlayersReady = () => {
                    return Object.keys(room.readyPlayers).length === Object.keys(state.playerHand).length
                },
                obmenProcces = (i, bot) => {
                    if (room.action !== 'soblazn')
                        room.gameLog.push({ action: 'obmen', actors: [room.playerSlots[room.currentPlayer], room.playerSlots[room.target]], bot: bot })
                    let karta1 = state.playerHand[room.currentPlayer][state.obmenCardIndex];
                    let karta2 = state.playerHand[room.target][i];
                    if (karta1.id !== 'nechto' && karta2.id !== 'nechto') {
                        if (karta1.id == 'zarajenie' && room.currentPlayer == state.nechto
                            && !state.zarajennie.includes(room.target) && !pidorstvo) {
                            state.zarajennie.push(room.target)
                        } else if (karta2.id == 'zarajenie' && room.target == state.nechto
                            && !state.zarajennie.includes(room.currentPlayer) && !pidorstvo) {
                            state.zarajennie.push(room.currentPlayer)
                        }
                        state.playerHand[room.currentPlayer][state.obmenCardIndex] = karta2;
                        state.playerHand[room.target][i] = karta1;
                        endRound()
                    }
                },
                chekSosedaNaPidora = (target, slot) => { // true kodga NE pidor (pidor bez dveri)
                    slot = slot ?? room.currentPlayer
                    const nextPlayer = slot, prevPLayer = getNextPlayer(true, slot);
                    // return (!room.dveri.includes(prevPLayer) && prevPLayer === target) 
                    //     || (!room.dveri.includes(nextPlayer))
                    return prevPLayer === target ? !room.dveri.includes(prevPLayer) : !room.dveri.includes(nextPlayer)
                },
                starieVerevkiPanika = () => {
                    if (Object.keys(room.karantin).length > 0) {
                        for (let i = Object.keys(room.karantin).length; i > 0; i--) {
                            slometKarantin()
                        }
                    }
                    room.karantin = {}
                    room.currentPanika = null
                    update()
                    startObmen()
                },
                triChetyrePanika = () => {
                    for (let i = room.dveri.length; i > 0; i--) {
                        slomatDver()
                    }
                    room.dveri = []
                    room.currentPanika = null
                    startObmen()
                },
                uuupsPamnika = () => {
                    room.showAllHand = state.playerHand[room.currentPlayer]
                    room.action = 'showUPS'
                    startTimer()
                },
                iViEtoNazivaeteVecherinkoyPanika = () => {
                    for (let i = room.dveri.length; i > 0; i--) {
                        slomatDver()
                    }
                    room.dveri = [];
                    if (Object.keys(room.karantin).length > 0) {
                        for (let i = Object.keys(room.karantin).length; i > 0; i--) {
                            slometKarantin()
                        }
                    }
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
                        room.target = null
                        startTimer()
                        update()
                        startObmen()
                    }
                },
                tolkoMejduNamiPanika = (target, slot) => {
                    if (target === getNextPlayer(room.invertDirection)
                        || target === getNextPlayer(!room.invertDirection)) {
                        state.showCard[target] = state.playerHand[slot]
                        room.currentPanika = null
                        startObmen()
                    }
                },
                davaiDrujitPanika = (target, slot, index) => {
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
                        update()
                    }
                },
                svidanieVSlepuyuPanika = (slot, index) => {
                    grabNewCard(slot)
                    state.deck.unshift(state.playerHand[slot][index])
                    state.playerHand[slot].splice(index, 1)
                    room.currentPanika = null
                    endRound()
                },
                zabivchevostChekCard = (slot) => {
                    const ruka = [...state.playerHand[slot]]
                    const newRuka = ruka.filter(it => chekDropCardCard(slot, it))
                    if (newRuka.length > 3) {
                        const hui = shuffleArray(newRuka)
                        zabivchivostPanika(slot, hui[1], hui[0], hui[2])
                    }
                    endRound()
                },
                zabivchivostPanika = (slot, index1, index2, index3, isCringe) => {
                    if (new Set([index1, index2, index3]).size == 3) {
                        if (!state.zarajennie.includes(slot) || isCringe) {
                            if (slot === room.currentPlayer &&
                                [index1, index2, index3].every((ind) => ind >= 0 && ind <= 4
                                    && state.playerHand[slot][ind].id !== "nechto")) {
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
                        } else {
                            if (state.playerHand[slot][state.playerHand[slot].findIndex((card, ind) =>
                                ![index1, index2, index3].includes(ind))].id === 'zarajenie')
                                zabivchivostPanika(slot, index1, index2, index3, true)
                        }
                    }
                },
                calcZar = (slot) => {
                    let zarC = 0
                    state.playerHand[slot].forEach(el => {
                        if (el.id === 'zarajenie')
                            zarC++
                    });
                    return zarC
                },
                shufflePlayerSLots = () => {
                    room.playerSlots = shuffleArray(room.playerSlots)
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
                            state.discard.push(...state.playerHand[slot].splice(index, 1));
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
                            room.gameLog.push({ card: card, actors: [room.playerSlots[room.currentPlayer], (room.target || room.target === 0) ? room.playerSlots[room.target] : null] })
                        }
                        const nextPlayer = getNextPlayer(room.invertDirection)
                        const prevPLayer = getNextPlayer(!room.invertDirection)
                        const gagaga = !!state.playerHand[target]
                        if (!room.karantin[slot] && Object.keys(state.playerHand[slot]).length === 5) {
                            if (card.target === 'any' && target !== null && gagaga) {
                                if (!room.karantin[target]) {
                                    if (card.id === 'smaivayUdochki') {
                                        room.action = 'smaivayUdochki'
                                        room.target = target
                                        room.waitMoveSlot = target
                                        sigrat()
                                        logs()
                                        updateState()
                                        update()
                                    } else if (card.id === 'soblazn') {
                                        room.action = 'soblazn'
                                        room.target = target
                                        sigrat()
                                        logs()
                                        startTimer()
                                        updateState()
                                        update()
                                    }
                                }
                            } else if (card.target === 'sosed' &&
                                (prevPLayer === target || nextPlayer === target) && gagaga) {
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
                            } else if (card.target === 'selfOrSosed' && (prevPLayer === target ||
                                nextPlayer === target || target === slot) && gagaga) {
                                if (card.id === 'topor') {
                                    if (!chekSosedaNaPidora(target)) {
                                        room.dveri.splice(room.dveri.indexOf(getNextPlayer(true, slot) == target ? target : slot), 1)
                                        logs()
                                        sigrat()
                                        slomatDver()
                                        startObmen()
                                    } else if (room.karantin[target]) {
                                        delete room.karantin[target]
                                        logs()
                                        sigrat()
                                        slometKarantin()
                                        startObmen()
                                    }
                                } else if (card.id === 'zakolchennayDver') {
                                    if (chekSosedaNaPidora(target)) {
                                        room.dveri.push(getNextPlayer(true, slot) == target ? target : slot)
                                        logs()
                                        state.playerHand[slot].splice(index, 1);
                                        startObmen()
                                    }
                                } else if (card.id === 'karantin') {
                                    if (chekSosedaNaPidora(target) || slot === target) {
                                        room.target = target
                                        room.karantin[target] = 2 //2 turns lol
                                        state.playerHand[slot].splice(index, 1);
                                        seflKarantin = true
                                        logs()
                                        startObmen()
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
                                    room.action = 'viski'
                                    logs()
                                    sigrat()
                                    update()
                                    updateState()
                                    startTimer()
                                }
                            }
                        }
                    }
                },
                "resolve-action": (slot, index) => {
                    let gagaga
                    const card = state.playerHand[slot][index];
                    if (room.action !== 'uporstvo')
                        gagaga = !!state.playerHand[room.target]
                    if (index >= 0 && index < 4 && slot === room.target && (gagaga || room.action == 'uporstvo')) {
                        const sigrat = () => {
                            state.discard.push(card);
                            state.playerHand[slot].splice(index, 1);
                            grabNewCard(room.target)
                        };
                        const logsOne = () => {
                            room.gameLog.push({ card: card, actors: [room.playerSlots[room.target]] })
                        };
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
                                sigrat()
                                logsOne()
                                startObmen()
                            }
                        } else if (room.phase === 3 || room.action === 'soblazn') {
                            if (card.id === 'mimo') {
                                logsOne()
                                sigrat()
                                room.target = getNextPlayer(room.invertDirection, room.target)
                                room.waitMoveSlot = room.target
                                pidorstvo = true
                                startTimer()
                                update()
                                updateState()
                            } else if (card.id === 'strah') {
                                sigrat()
                                logsOne()
                                state.showCard[room.target] = [state.playerHand[room.currentPlayer][state.obmenCardIndex]]
                                room.action = 'strah'
                                room.waitMoveSlot = room.target
                                startTimer()
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
                        if (obmenChekZarajeniy(slot, index)) {
                            state.obmenCardIndex = index;
                            room.isObmenReady = true;
                            room.waitMoveSlot = room.target
                            startTimer()
                            update()
                            updateState()
                        }
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
                            room.action = null
                            startTimer()
                            update()
                            updateState()
                        }
                    }
                },
                "resolve-soblazn": (slot, index) => {
                    if (slot === room.target && index >= 0 && index < 4
                        && room.action === 'soblazn' && room.isObmenReady
                        && obmenChekZarajeniy(slot, index)) {
                        obmenProcces(index)
                    }
                },
                "resolve-obmen": (slot, index) => {
                    if (slot === room.target && index >= 0 && index < 4) {
                        if (room.isObmenReady && obmenChekZarajeniy(slot, index)) {
                            room.gameLog.push({ actors: room.currentPlayer, act: 'resolve-obmenivatsa' })
                            obmenProcces(index)
                        }
                    }
                },
                "vilojit-kartu-na-obmen": (slot, index) => {
                    if (slot === room.currentPlayer && index >= 0 && index < 4 && obmenChekZarajeniy(slot, index)) {
                        room.isObmenReady = true;
                        state.obmenCardIndex = index;
                        room.showAllHand = null
                        room.waitMoveSlot = room.target
                        room.gameLog.push({ actors: room.currentPlayer, act: 'start-obmenivatsa' })
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
                            if (target !== null && !room.karantin[target]) {
                                razDvaPanika(target)
                            }
                        } else if (card.id === 'ubiraysyaProch') {
                            if (target !== null && state.playerHand[target]) {
                                room.target = target
                                ubiraysyaProchPanika(target, slot)
                            }
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
                            if (index >= 0 && index < 4 && !state.tsepnayaReaksiaObmenKard[slot])
                                tsepnayaReaksiaPanika(slot, index)
                        } else if (card.id === 'triChetyre') {
                            triChetyrePanika()
                        } else if (card.id === 'uups') {
                            if (!room.showAllHand)
                                uuupsPamnika()
                        } else if (card.id === 'svidanieVSlepuyu') {
                            if (proccesProverkaNaDolbaeba(room.currentPlayer)) {
                                playerKill(room.currentPlayer)
                                endRound()
                            }
                            else if (index !== null
                                && (getHandCard(slot, index).id !== 'zarajenie' || calcZar(slot))
                                && getHandCard(slot, index).id !== 'nechto')
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
                "toggle-pause": (user) => {
                    if (user === room.hostId)
                        room.paused = !room.paused;
                    update()
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
                "shuffle-players": (user) => {
                    if (room.hostId === user && room.phase === 0) {
                        shufflePlayerSLots()
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
