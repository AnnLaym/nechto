const { read } = require('fs')
const { start } = require('repl')
const utils = require('./utils.cjs')
const { get } = require('http')
const { isNumber } = require('util')
const { pid } = require('process')
const indexOf = require('@vitejs/plugin-vue')
const { shuffleArray } = require('./utils.cjs')

function init(wsServer, path) {
    const
        app = wsServer.app,
        registry = wsServer.users,
        EventEmitter = require('events'),
        channel = 'citadels',
        //testMode = process.argv[2] === "debug";
        testMode = false

    app.use('/nechto', wsServer.static(`${__dirname}/dist`))
    registry.handleAppPage(path, `${__dirname}/dist/index.html`, `${__dirname}/dist/manifest.json`, '/nechto/')

    class GameState extends wsServer.users.RoomState {
        constructor(hostId, hostData, userRegistry, registry) {
            super(hostId, hostData, userRegistry, registry.games.citadels.id, path)
            let interval
            const flags = {
                selfKarantin: false,
                vremyaPriznaniyEnd: false,
                deadWhenCringe3: false,
                // TODO: добавить 3 длц
            }
            let testUserId = []
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
                invertDirection: false, // true - против часовой
                startWithNechto: true,
                action: null,
                karantin: {},
                time: 20,
                timed: true,
                readyPlayers: {},
                target: null,
                dveri: [],
                showAllHand: null,
                allReadyNedeed: false,
                vremyaPriznaniySlot: null,
                gameLog: [],
                smallTimer: 10,
                bigTimer: 30,
                isObmenReady: false,
                voting: false,
                currentPanika: null,
                fullTimer: 0,
                waitMoveSlot: null,
                startSlotColor: {},
                playerAvatars: {},
                normSosed: null,
                normPlayer: null,
                normThirdPlayers: null,
                deckList: [],
                winner: null,
            }
            if (true || testMode) {
                [0, 2, 4, 6].forEach(ind => {
                    room.playerSlots[ind] = `kek${ind}`
                    room.playerNames[`kek${ind}`] = `kek${ind}`
                    room.karantin[ind] = 10
                })
            }
            this.room = room
            this.lastInteraction = new Date()
            const state = {
                nechto: null,
                zarajennie: [],
                survivors: [],
                umerZarajennim: [],
                umerChelovekom: [],
                deck: [],
                discard: [],
                playerHand: {},
                obmenCardIndex: null,
                showCard: {},
                uporstvoCards: {},
                tsepnayaReaksiaObmenKard: {},
            }
            this.state = state

            // initiate
            const startTimer = () => {
                //TODO: в мозиле не роботает. и прокрутка на мозиле справа - удоли
                if (testMode) {
                    if (
                        testUserId.includes(room.playerSlots[room.waitMoveSlot])
                        || testUserId.includes(room.playerSlots[room.vremyaPriznaniySlot])
                    ) {
                        room.smallTimer = 10
                        room.bigTimer = 15
                    } else {
                        room.smallTimer = 0.4
                        room.bigTimer = 0.4
                    }
                }
                const needTimer = room.action === utils.cardsDeck.strah.id
                    || room.action === utils.cardsDeck.viski.id
                    || (room.currentPanika?.id === utils.cardsDeck.uups.id && room.showAllHand !== null)
                    || (room.currentPanika?.id === utils.cardsDeck.vremyaPriznaniy.id && room.showAllHand !== null)
                if (room.timed && !room.paused) {
                    clearInterval(interval)
                    if (room.phase === 0) return

                    if (room.phase === 1) {
                        room.time = room.smallTimer * 1000
                    } else if (room.phase === 2) {
                        if (needTimer) {
                            room.time = room.smallTimer * 1000
                        } else
                            room.time = room.bigTimer * 1000
                    } else if (room.phase === 3) {
                        room.time = room.bigTimer * 1000
                    }

                    let time = new Date()
                    interval = setInterval(() => {
                        if (!room.paused) {
                            room.time -= new Date() - time
                            time = new Date()
                            if (room.time <= 0) {
                                clearInterval(interval)
                                resolvePassAction()
                            }
                        }
                    }, 100)
                    room.fullTimer = room.time
                    update()
                    updateState()
                } else if (needTimer) {
                    room.time = room.smallTimer * 1000
                    let time = new Date()
                    interval = setInterval(() => {
                        room.time -= new Date() - time
                        time = new Date()
                        if (room.time <= 0) {
                            clearInterval(interval)
                            resolvePassAction()
                        }
                    }, 100)
                    update()
                    updateState()
                }
            }
            const startGame = () => {
                state.playersCount = room.playerSlots.filter((user) => user !== null).length
                if (state.playersCount > 3) {
                    room.timed = true
                    room.playerHand = {}
                    room.normSosed = null
                    room.normPlayer = null
                    room.normThirdPlayers = null
                    room.teamsLocked = true
                    state.tsepnayaReaksiaObmenKard = {}
                    room.currentPanika = null
                    if (!testMode) {
                        shufflePlayerSLots()
                        room.karantin = {}
                    }
                    room.currentPlayer = utils.shuffleArray(room.playerSlots.map((it, index) => index).filter(inx => room.playerSlots[inx]))[0]
                    room.isNextCardPanika = null
                    room.invertDirection = (Math.floor(Math.random() * 10) + 1) % 2 !== 0
                    room.gameLog = []
                    state.showCard = {}
                    room.isObmenReady = false
                    state.obmenCardIndex = null
                    state.discard = []
                    room.winner = null
                    room.gameLog.push({ action: 'start-game', nechto: room.startWithNechto })
                    state.nechto = null
                    state.zarajennie = []
                    state.survivors = room.playerSlots.map((it, index) => index).filter(inx => room.playerSlots[inx])
                    room.deckList = Object.keys(utils.cardsDeck).map(key => ({
                        [key]: utils.cardsDeck[key].count[state.survivors.length],
                    }))
                    state.umerZarajennim = []
                    state.umerChelovekom = []
                    room.action = null
                    room.dveri = []
                    room.showAllHand = null
                    room.vremyaPriznaniySlot = null
                    state.deck = utils.createDeck(state.playersCount, room.startWithNechto, testMode)
                    room.playerSlots.forEach((player, slot) => {
                        if (player !== null) {
                            state.playerHand[slot] = state.deck.splice(0, 4)
                        } else {
                            delete state.playerHand[slot]
                        }
                    })
                    room.playerSlots.forEach((player, slot) => {
                        room.startSlotColor[player] = slot
                    })
                    if (testMode) {
                        room.gameLog.push({ action: 'test-mode' })
                        Object.entries(room.playerNames).forEach(([k, v]) => {
                            if (v.includes('test')) testUserId.push(k)
                        })
                        if (testUserId.length > 0 && testUserId.some(id => room.playerSlots.includes(id))) {
                            room.currentPlayer = room.playerSlots.indexOf(testUserId[0])
                        }
                    }

                    if (room.startWithNechto) {
                        Object.keys(state.playerHand).map(Number).forEach(slot => {
                            state.playerHand[slot].forEach(card => {
                                if (card.id === utils.cardsDeck.nechto.id) {
                                    becomeNechto(slot)
                                }
                            })
                        })
                    }
                    startRound()
                }
            }
            const pizdets = () => {
                room.gameLog.push({ action: 'pizdets' })
                endGame()
            }
            const isGameEnd = (target) => {
                if (state.zarajennie.length + (state.nechto ? 1 : 0) === Object.keys(state.playerHand).length) {
                    endGame()
                } else if (target === state.nechto) {
                    endGame('nechtoZdohlo')
                } else if (Object.keys(state.playerHand).length === 1 && !state.nechto) {
                    pizdets()
                }
            }
            const endGame = (nechtoZdohlo) => {
                room.timed = false
                room.currentPlayer = null
                room.phase = 0
                room.currentPanika = null
                room.action = null
                room.target = null
                room.showAllHand = null
                room.vremyaPriznaniySlot = null
                room.isObmenReady = false
                state.uporstvoCards = {}
                if (state.nechto && nechtoZdohlo) {
                    room.winner = 'ebanati'
                } else if (state.nechto && state.zarajennie.length + (state.nechto ? 1 : 0) === Object.keys(state.playerHand).length) {
                    room.winner = 'nechto and team'
                }
                state.survivors = state.survivors.filter(slot => ![...state.zarajennie, ...state.umerZarajennim, ...state.umerChelovekom, state.nechto].includes(slot))
                room.gameLog.push({ action: 'end-game' })
                flags.selfKarantin = false
                flags.vremyaPriznaniyEnd = false
                update()
                updateState()
            }
            const startRound = () => {
                room.phase = 1
                state.uporstvoCards = {}
                state.showCard = {}
                room.target = null
                room.currentPanika = null
                room.waitMoveSlot = room.currentPlayer
                room.gameLog.push({ action: 'start-round', actors: [room.playerSlots[room.currentPlayer]] })
                state.tsepnayaReaksiaObmenKard = {}
                room.readyPlayers = {}
                flags.selfKarantin = false
                flags.vremyaPriznaniyEnd = false
                Object.keys(state.playerHand).map(Number).forEach(player => {
                    if (player !== room.currentPlayer) {
                        processKrinj(player)
                    }
                })
                findNormPlayers()
                startTimer()
                update()
                updateState()
            }
            const endRound = () => {
                room.target = null
                Object.keys(state.playerHand).map(Number).forEach(player => {
                    processKrinj(player)
                })
                if (flags.deadWhenCringe3 && state.playerHand[room.currentPlayer]) {
                    processKrinj(room.currentPlayer, 3)
                }
                if (room.karantin[room.currentPlayer] && !flags.selfKarantin) {
                    room.karantin[room.currentPlayer]--
                    if (room.karantin[room.currentPlayer] === 0) {
                        pushDiscardKarantin()
                    }
                }
                isGameEnd()
                if (room.phase === 0) {
                    return
                }
                room.currentPlayer = getNextPlayer()
                room.currentPanika = null
                room.action = null
                state.obmenCardIndex = null
                room.isObmenReady = false
                room.normSosed = null
                room.normPlayer = null
                room.normThirdPlayers = null
                room.showAllHand = null
                room.vremyaPriznaniySlot = null
                state.tsepnayaReaksiaObmenKard = {}
                room.readyPlayers = {}
                flags.selfKarantin = false
                flags.vremyaPriznaniyEnd = false
                update()
                updateState()
                if (room.phase !== 0) {
                    startRound()
                }
            }
            const notEndRound = () => {
                state.showCard = {}
                room.waitMoveSlot = room.currentPlayer
                room.action = null
                room.currentPanika = null
                room.isObmenReady = null
                state.obmenCardIndex = null
                startTimer()
                update()
                updateState()
                startObmen()
            }
            const becomeNechto = (slot) => {
                if (state.nechto || state.nechto === 0) {
                    pizdets()
                } else {
                    state.nechto = slot
                }
            }
            const update = () => {
                let freshUmerSlots = []
                if (room.phase !== 0) {
                    freshUmerSlots = Object.keys(room.playerSlots)
                        .map(Number)
                        .filter(slot => (!state.playerHand[slot] && room.playerSlots[slot] !== null) || state.umerZarajennim.includes(slot) || state.umerChelovekom.includes(slot))
                }
                userRegistry.send(room.onlinePlayers, 'state', {
                    ...room,
                    discardSize: state.discard.length,
                    deckSize: state.deck.length,
                    umerSlots: freshUmerSlots,
                    survivors: state.survivors,
                    dveriClient: calcDveriClient(),
                    isNextCardPanika: calcNextCardPanika(),
                    isPrevCardPanika: calcPrevCardPanika(),
                })
            }
            const updatePlayerState = (user) => {
                const slot = room.playerSlots.indexOf(user)
                if (room.phase === 0) {
                    userRegistry.send(user, 'player-state', {
                        nechto: state.nechto,
                        zarajennie: state.zarajennie,
                        umerZarajennim: state.umerZarajennim,
                        umerChelovekom: state.umerChelovekom,
                        cards: null,
                        chekCards: null,
                    })
                } else if (room.playerSlots.includes(user)) {
                    if (testMode && testUserId.includes(user)) {
                        userRegistry.send(user, 'player-state', {
                            nechto: state.nechto,
                            zarajennie: state.zarajennie,
                            umerZarajennim: state.umerZarajennim,
                            cards: state.playerHand[slot],
                            chekCards: state.showCard[slot] ? state.showCard[slot] : null,
                        })
                    } else if (state.nechto === slot) {
                        userRegistry.send(user, 'player-state', {
                            nechto: state.nechto,
                            zarajennie: state.zarajennie,
                            cards: state.playerHand[slot],
                            chekCards: state.showCard[slot] ? state.showCard[slot] : null,
                        })
                    } else if (state.zarajennie.includes(slot)) {
                        userRegistry.send(user, 'player-state', {
                            nechto: state.nechto,
                            zarajennie: [slot],
                            cards: state.playerHand[slot],
                            chekCards: state.showCard[slot] ? state.showCard[slot] : null,
                        })
                    } else {
                        userRegistry.send(user, 'player-state', {
                            nechto: null,
                            zarajennie: null,
                            cards: state.playerHand[slot],
                            chekCards: state.showCard[slot] ? state.showCard[slot] : null,
                        })
                    }
                } else {
                    userRegistry.send(user, 'player-state', {})
                }
            }
            const updateState = () => [...room.onlinePlayers].forEach(user => updatePlayerState(user))
            const startObmen = () => {
                isGameEnd()
                if (!(calcZarajenieCount(room.currentPlayer) >= 4) && state.phase !== 0) {
                    room.phase = 3
                    room.target = getNextPlayer()
                    room.action = null
                    room.currentPanika = null
                    room.showAllHand = null
                    if (isDoorMissing(room.target)
                        && !room.karantin[room.target]
                        && !room.karantin[room.currentPlayer]
                    ) {
                        startTimer()
                        update()
                        updateState()
                    } else {
                        endRound()
                    }
                } else {
                    endRound()
                }
            }
            const obmenProcces = (index, bot) => {
                //TODO: добавить на обмене чтобы не падал карт
                room.gameLog.push({
                    action: 'obmen',
                    actors: [room.playerSlots[room.currentPlayer], room.playerSlots[room.target]],
                    bot: bot,
                })
                if (typeof state.obmenCardIndex !== 'number' || isNaN(state.obmenCardIndex)) {
                    pizdets()
                }
                let karta1 = state.playerHand[room.currentPlayer][state.obmenCardIndex]
                let karta2 = state.playerHand[room.target][index]
                if (karta1.id !== utils.cardsDeck.nechto.id && karta2.id !== utils.cardsDeck.nechto.id) {
                    if (karta1.id === utils.cardsDeck.zarajenie.id
                        && room.currentPlayer === state.nechto
                        && !state.zarajennie.includes(room.target)
                    ) {
                        state.zarajennie.push(room.target)
                    } else if (karta2.id === utils.cardsDeck.zarajenie.id
                        && room.target === state.nechto
                        && !state.zarajennie.includes(room.currentPlayer)
                    ) {
                        state.zarajennie.push(room.currentPlayer)
                    }
                    state.playerHand[room.currentPlayer][state.obmenCardIndex] = karta2
                    state.playerHand[room.target][index] = karta1
                    if (room.currentPanika?.id === utils.cardsDeck.davaiDrujit.id) {
                        notEndRound()
                    } else {
                        endRound()
                    }
                }
            }
            // status
            const processKrinj = (slot, maxZ) => {
                maxZ = maxZ ?? 4
                if (calcZarajenieCount(slot) >= maxZ && state.nechto !== slot) {
                    room.gameLog.push({ smetKrinj: 'smetKrinj', actors: [room.playerSlots[slot]] })
                    playerKill(slot)
                }
            }
            const playerKill = (target) => {
                state.discard.push(...state.playerHand[target])
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
                } else if (target !== state.nechto) {
                    state.umerChelovekom.push(target)
                }
                if (target === state.nechto) {
                    isGameEnd(target)
                }
            }
            // doors
            const calcDveriClient = () => {
                const result = {}
                for (let slot of Object.keys(state.playerHand).map(Number)) {
                    result[slot] = {
                        prev: !isDoorMissing(getNextPlayer(true, slot), slot),
                        next: room.dveri.includes(slot),
                    }
                }
                return result
            }
            const isDoorMissing = (target, slot) => {
                const nextPlayer = slot ?? room.currentPlayer
                const prevPLayer = getNextPlayer(true, nextPlayer)
                return prevPLayer === target ? !room.dveri.includes(prevPLayer) : !room.dveri.includes(nextPlayer)
            }
            // phase step
            const getRandomObmenCardIndex = (slot, target) => {
                target = target ?? room.target
                let result
                if (slot === state.nechto) {
                    result = indexesHandWithoutNechto(state.playerHand[slot])
                } else if (state.zarajennie.includes(slot) && target === state.nechto) {
                    result = indexesHandWithoutZarajenie(state.playerHand[slot])
                } else {
                    result = state.playerHand[slot]
                        .map((card, index) => card.id !== utils.cardsDeck.zarajenie.id ? index : null)
                        .filter(index => index !== null)
                }
                if (result.length === 0 || result.some(index => getHandCard(slot, index).id === utils.cardsDeck.nechto.id)) {
                    pizdets()
                }
                return utils.shuffleArray(result)[0]
            }
            const getRandomDropCardIndex = (slot) => {
                let result
                if (slot === state.nechto) {
                    result = indexesHandWithoutNechto(state.playerHand[slot])
                } else if (state.zarajennie.includes(slot)) {
                    result = indexesHandWithoutZarajenie(state.playerHand[slot])
                } else {
                    result = state.playerHand[slot].map((card, index) => index)
                }
                if (result.length === 0 || result.some(index => getHandCard(slot, index).id === utils.cardsDeck.nechto.id)) {
                    pizdets()
                }
                return utils.shuffleArray(result)[0]
            }
            const resolvePassAction = () => {
                if (room.phase === 1) {
                    grabCard(true)
                } else if (room.phase === 3 && room.action !== utils.cardsDeck.strah.id) {
                    if (room.isObmenReady) {
                        startTimer()
                        update()
                        updateState()
                        obmenProcces(getRandomObmenCardIndex(room.target))
                    } else {
                        state.obmenCardIndex = getRandomObmenCardIndex(room.currentPlayer)
                        room.isObmenReady = true
                        room.waitMoveSlot = room.target
                        room.target = getNextPlayer(room.invertDirection, room.currentPlayer)
                        startTimer()
                        update()
                        updateState()
                    }
                } else if (room.action) {
                    if (room.action === utils.cardsDeck.ognemet.id) {
                        playerKill(room.target)
                        room.gameLog.push({
                            actors: [room.playerSlots[room.currentPlayer], room.playerSlots[room.target]],
                            bot: true,
                        })
                        if (room.phase !== 0) {
                            room.waitMoveSlot = room.currentPlayer
                            room.target = null
                            update()
                            updateState()
                            startObmen()
                        }
                    } else if (room.action === utils.cardsDeck.soblazn.id) {
                        if (room.isObmenReady) {
                            obmenProcces(getRandomObmenCardIndex(room.target), state.obmenCardIndex)
                        } else {
                            room.isObmenReady = true
                            state.obmenCardIndex = getRandomObmenCardIndex(room.currentPlayer)
                            startTimer()
                            update()
                            updateState()
                        }
                    } else if (room.action === utils.cardsDeck.analiz.id) {
                        state.showCard = {}
                        startObmen()
                    } else if (room.action === utils.cardsDeck.podozrenie.id) {
                        state.showCard = {}
                        startObmen()
                    } else if ([utils.cardsDeck.menyaemsyaMestami.id, utils.cardsDeck.smativayUdochki.id].includes(room.action)) {
                        smenaMest(room.currentPlayer, room.target)
                        startObmen()
                    } else if (room.action === utils.cardsDeck.strah.id) {
                        if (room.currentPanika?.id === utils.cardsDeck.davaiDrujit.id) {
                            notEndRound()
                        } else {
                            state.showCard = {}
                            endRound()
                        }
                    } else if (room.action === utils.cardsDeck.viski.id) {
                        // TODO: Запускать, когда все нажали кнопку
                        room.showAllHand = null
                        startObmen()
                    } else if (room.action === utils.cardsDeck.uporstvo.id) {
                        let index = state.uporstvoCards.findIndex(card => card.id === utils.cardsDeck.nechto.id)
                        if (index === -1) {
                            index = utils.shuffleArray([0, 1, 2])[0]
                        }
                        state.playerHand[room.currentPlayer].push(...state.uporstvoCards.splice(index, 1))
                        state.discard.push(...state.uporstvoCards)
                        state.showCard = {}
                        room.action = null
                        startTimer()
                        update()
                        updateState()
                    }

                    if (room.currentPanika) {
                        if (room.currentPanika.id === utils.cardsDeck.tsepnayaReaksia.id) {
                            Object.keys(state.playerHand).map(Number).forEach(slot => {
                                if (!room.readyPlayers[slot]) {
                                    state.tsepnayaReaksiaObmenKard[slot] = getRandomObmenCardIndex(slot, getNextPlayer(room.invertDirection, slot))
                                }
                            })
                            startTsepnayaReaksia()
                        } else if (room.currentPanika.id === utils.cardsDeck.tolkoMejduNami.id) {
                            if (room.target === null) {
                                tolkoMejduNamiPanika(room.currentPlayer, utils.shuffleArray(getSosedPlayers())[0])
                            } else {
                                room.waitMoveSlot = room.currentPlayer
                                state.showCard = {}
                                startObmen()
                            }
                        } else if (room.currentPanika.id === utils.cardsDeck.razDva.id) {
                            if (room.target !== null && !room.karantin[room.target] && room.target !== room.currentPlayer) {
                                if (!getThirdPlayers().includes(room.target)) {
                                    pizdets()
                                }
                                smenaMest(room.target, room.currentPlayer)
                            } else if (room.target === null) {
                                const target = utils.shuffleArray(getThirdPlayers()).find(slot => !room.karantin[slot])

                                if (target !== null && target !== undefined) {
                                    room.target = target
                                    smenaMest(target, room.currentPlayer)
                                }
                            }
                            startObmen()
                        } else if (room.currentPanika.id === utils.cardsDeck.iViEtoNazivaeteVecherinkoy.id) {
                            iViEtoNazivaeteVecherinkoyPanika()
                            room.currentPanika = null
                            startObmen()
                        } else if (room.currentPanika.id === utils.cardsDeck.davaiDrujit.id) {
                            if (room.isObmenReady) {
                                obmenProcces(getRandomObmenCardIndex(room.target, room.currentPlayer))
                            } else {
                                const canBeTarget = Object.keys(state.playerHand).map(Number).filter(player => player !== room.currentPlayer)
                                if (canBeTarget.length > 1) {
                                    room.target = utils.shuffleArray(canBeTarget)[0]
                                    if (!room.karantin[room.target]) {
                                        state.obmenCardIndex = getRandomObmenCardIndex(room.currentPlayer)
                                        room.isObmenReady = true
                                        room.waitMoveSlot = room.target
                                        startTimer()
                                        update()
                                        updateState()
                                    } else {
                                        room.gameLog.push({
                                            action: 'ne-obmen',
                                            actors: [room.playerSlots[room.currentPlayer], room.playerSlots[room.target]],
                                        })
                                        notEndRound()
                                    }
                                }
                            }
                        } else if (room.currentPanika.id === utils.cardsDeck.svidanieVSlepuyu.id) {
                            svidanieVSlepuyuPanika(room.currentPlayer, getRandomDropCardIndex(room.currentPlayer))
                        } else if (room.currentPanika.id === utils.cardsDeck.ubiraysyaProch.id) {
                            const slots = Object.keys(state.playerHand).map(Number).filter(player => player !== room.currentPlayer && !room.karantin[player])
                            if (slots.length === 0) {
                                startObmen()
                                return
                            }
                            room.target = utils.shuffleArray(slots)[0]
                            ubiraysyaProchPanika(room.target, room.currentPlayer)
                        } else if (room.currentPanika.id === utils.cardsDeck.zabivchivost.id) {
                            zabivchivostChekCard(room.currentPlayer)
                        } else if (room.currentPanika.id === utils.cardsDeck.triChetyre.id) {
                            triChetyrePanika()
                        } else if (room.currentPanika.id === utils.cardsDeck.starieVerevki.id) {
                            starieVerevkiPanika()
                        } else if (room.currentPanika.id === utils.cardsDeck.uups.id) {
                            if (!room.showAllHand) {
                                uuupsPanika()
                            } else {
                                room.showAllHand = null
                                startObmen()
                            }
                        } else if (room.currentPanika.id === utils.cardsDeck.vremyaPriznaniy.id) {
                            if (room.vremyaPriznaniySlot === null) {
                                vremyaPriznaniyPanika()
                                return
                            }
                            if (room.vremyaPriznaniySlot === getNextPlayer(!room.invertDirection, room.currentPlayer) || flags.vremyaPriznaniyEnd) {
                                room.waitMoveSlot = room.currentPlayer
                                room.vremyaPriznaniySlot = null
                                room.currentPanika = null // это надо
                                room.action = null
                                startTimer()
                                update()
                                updateState()
                                startObmen()
                            } else {
                                room.vremyaPriznaniySlot = getNextPlayer(room.invertDirection, room.vremyaPriznaniySlot)
                                room.waitMoveSlot = room.vremyaPriznaniySlot
                                room.showAllHand = null
                                startTimer()
                                update()
                                updateState()
                            }
                        }
                    }
                } else if (room.phase === 2 && !room.currentPanika) {
                    const cardInd = getRandomDropCardIndex(room.currentPlayer)
                    state.discard.push(...state.playerHand[room.currentPlayer].splice(cardInd, 1))
                    room.gameLog.push({ action: 'drop-card', actors: [room.playerSlots[room.currentPlayer]] })
                    update()
                    updateState()
                    startObmen()
                }
            }
            // utils
            const resetStol = () => {
                room.karantin = {}
                room.winner = null
                state.nechto = null
                state.zarajennie = []
                state.survivors = []
                state.umerZarajennim = []
                state.umerChelovekom = []
                state.umerSlots = []
            }
            const reshuffle = () => {
                if (state.deck.length === 0) {
                    state.deck = [...state.discard]
                    utils.shuffleArray(state.deck)
                    state.discard = []
                    room.gameLog.push({ action: 'reshuffle' })
                }
            }
            const getNextPlayer = (invert, slot) => {
                invert = invert ?? room.invertDirection
                slot = slot ?? room.currentPlayer
                if (invert === false) {
                    slot++
                    while (!state.playerHand[slot]) {
                        if (slot > 11)
                            slot = 0
                        else
                            slot++
                    }
                    return slot
                } else {
                    slot--
                    while (!state.playerHand[slot]) {
                        if (slot < 0)
                            slot = 11
                        else
                            slot--
                    }
                    return slot
                }
            }
            const getSosedPlayers = () => {
                return [getNextPlayer(room.invertDirection), getNextPlayer(!room.invertDirection)]
            }
            const getThirdPlayers = () => {
                const ind = 3
                let slot = room.currentPlayer
                let i = 0
                while (i < ind) {
                    do {
                        slot++
                        if (slot > 11) {
                            slot = 0
                        }
                    } while (!state.playerHand[slot])
                    i++
                }
                let slotA = room.currentPlayer
                let o = 0
                while (o < ind) {
                    do {
                        slotA--
                        if (slotA < 0) {
                            slotA = 11
                        }
                    } while (!state.playerHand[slotA])
                    o++
                }
                return [slot, slotA]
            }
            const findNormPlayers = () => {
                room.normSosed = []
                room.normPlayer = []
                room.normThirdPlayers = []
                Object.keys(state.playerHand).map(Number).forEach(player => {
                    if ((getSosedPlayers().includes(player)) && !room.karantin[player]) {
                        room.normSosed.push(player)
                    }
                    if (getThirdPlayers().includes(player) && !room.karantin[player]) {
                        room.normThirdPlayers.push(player)
                    }
                    if (!room.karantin[player]) {
                        room.normPlayer.push(player)
                    }
                })
            }
            const findNewPlayerToMove = () => {
                if (room.phase === 3 && room.isObmenReady) {
                    room.waitMoveSlot = room.target
                } else if (room.phase === 3 && !room.isObmenReady) {
                    room.waitMoveSlot = room.currentPlayer
                } else if (room.phase === 2) {
                    room.waitMoveSlot = room.currentPlayer
                }
            }
            const smenaMest = (slot1, slot2) => {
                if (slot1 === slot2) {
                    findNewPlayerToMove()
                    return
                }

                if (room.currentPlayer === slot1) {
                    room.currentPlayer = slot2
                } else if (room.currentPlayer === slot2) {
                    room.currentPlayer = slot1
                }

                if (room.target === slot1) {
                    room.target = slot2
                } else if (room.target === slot2) {
                    room.target = slot1
                }

                if (slot1 === state.nechto) {
                    state.nechto = slot2
                } else if (slot2 === state.nechto) {
                    state.nechto = slot1
                }

                const karantin1 = room.karantin[slot1]
                const karantin2 = room.karantin[slot2]
                if (karantin2 !== undefined) {
                    room.karantin[slot1] = karantin2
                } else {
                    delete room.karantin[slot1]
                }
                if (karantin1 !== undefined) {
                    room.karantin[slot2] = karantin1
                } else {
                    delete room.karantin[slot2]
                }

                const zarajenSlot1 = state.zarajennie.includes(slot1)
                const zarajenSlot2 = state.zarajennie.includes(slot2)
                if (zarajenSlot1 && !zarajenSlot2) {
                    state.zarajennie.splice(state.zarajennie.indexOf(slot1), 1)
                    state.zarajennie.push(slot2)
                } else if (zarajenSlot2 && !zarajenSlot1) {
                    state.zarajennie.splice(state.zarajennie.indexOf(slot2), 1)
                    state.zarajennie.push(slot1)
                }

                const chel1 = room.playerSlots[slot1]
                const chel2 = room.playerSlots[slot2]
                const ruka1 = state.playerHand[slot1]
                const ruka2 = state.playerHand[slot2]
                room.playerSlots[slot1] = chel2
                room.playerSlots[slot2] = chel1
                state.playerHand[slot1] = ruka2
                state.playerHand[slot2] = ruka1
                findNewPlayerToMove()
            }
            const grabCard = (bot) => {
                room.phase = 2
                room.gameLog.push({ action: 'grab-card', actors: [room.playerSlots[room.currentPlayer]] })
                reshuffle()
                const card = state.deck.shift()
                reshuffle()
                if (card.type === utils.cardTypes.panika) {
                    room.currentPanika = card
                    room.allReadyNedeed = card.allReady
                    room.action = card.id
                    room.gameLog.push({ card: card, panika: true, bot: bot })
                    state.discard.push(card)
                } else {
                    state.playerHand[room.currentPlayer].push(card)
                    if (card.id === utils.cardsDeck.nechto.id) {
                        becomeNechto(room.currentPlayer)
                    }
                }
                startTimer()
                update()
                updateState()
            }
            const grabNewCard = (player) => state.playerHand[player].push(dealNewCard(player))
            const dealNewCard = (player) => {
                player = player ?? room.currentPlayer
                reshuffle()
                let card = state.deck.shift()
                reshuffle()
                while (card.type === utils.cardTypes.panika) {
                    state.discard.push(card)
                    card = state.deck.shift()
                    reshuffle()
                }
                if (card.id === utils.cardsDeck.nechto.id) {
                    becomeNechto(player)
                }
                return card
            }
            const chekDropCard = (slot, index) => {
                const card = getHandCard(slot, index)
                if (card.id === utils.cardsDeck.nechto.id) {
                    return false
                } else if (state.nechto === slot || !state.zarajennie.includes(slot) || (calcZarajenieCount(slot) >= 2 || card.id !== utils.cardsDeck.zarajenie.id)) {
                    return true
                }
            }
            const indexesHandWithoutNechto = (hand) => {
                return hand
                    .map((card, index) => card.id !== utils.cardsDeck.nechto.id ? index : null)
                    .filter(index => index !== null)
            }
            const indexesHandWithoutZarajenie = (hand) => {
                let govno
                return hand
                    .map((card, index) => {
                        if (card.id === utils.cardsDeck.zarajenie.id && !govno) {
                            govno = true
                            return null
                        } else {
                            return index
                        }
                    })
                    .filter(index => index !== null)
            }
            const calcZarajenieCount = (slot) => {
                return Object.values(state.playerHand[slot]).filter(card => card.id === utils.cardsDeck.zarajenie.id).length
            }
            const pushDiscardDver = () => {
                state.discard.push(utils.cardsDeck.zakolchennayDver)
            }
            const pushDiscardKarantin = () => {
                state.discard.push(utils.cardsDeck.karantin)
            }
            const obmenChekZarajeniy = (slot, index, target) => {
                if (![0, 1, 2, 3].includes(index)) return false

                const card = getHandCard(slot, index)
                if (card.id === utils.cardsDeck.nechto.id) {
                    return false
                } else if (card.id === utils.cardsDeck.zarajenie.id && slot === state.nechto) {
                    return true
                } else if (
                    card.id === utils.cardsDeck.zarajenie.id && target === state.nechto
                    && state.zarajennie.includes(slot) && calcZarajenieCount(slot) > 1
                ) {
                    return true
                } else if (card.id !== utils.cardsDeck.zarajenie.id) {
                    return true
                }
            }
            const getHandCard = (slot, index) => {
                return state.playerHand[slot][index]
            }
            const userJoin = (data) => {
                const user = data.userId
                if (!room.playerNames[user])
                    room.spectators.add(user)
                room.onlinePlayers.add(user)
                room.playerNames[user] = data.userName.substr && data.userName.substr(0, 60)
                update()
                updateState()
            }
            const userLeft = (user) => {
                room.onlinePlayers.delete(user)
                if (room.spectators.has(user))
                    delete room.playerNames[user]
                room.spectators.delete(user)
                update()
                updateState()
            }
            const userEvent = (user, event, data) => {
                this.lastInteraction = new Date()
                try {
                    if (this.userEventHandlers[event])
                        this.userEventHandlers[event](user, data[0], data[1], data[2], data[3])
                    else if (this.slotEventHandlers[event] && ~room.playerSlots.indexOf(user))
                        this.slotEventHandlers[event](room.playerSlots.indexOf(user), data[0], data[1], data[2], data[3], data[4])
                } catch (error) {
                    console.error(error)
                    registry.log(error.message)
                }
            }
            const isAllPlayersReady = () => {
                return Object.keys(room.readyPlayers).length === Object.keys(state.playerHand).length
            }
            const shufflePlayerSLots = () => {
                room.playerSlots = utils.shuffleArray(room.playerSlots)
            }
            const removePlayer = (playerId) => {
                if (room.spectators.has(playerId)) {
                    this.emit('user-kicked', playerId)
                    room.spectators.delete(playerId)
                } else {
                    room.playerSlots[room.playerSlots.indexOf(playerId)] = null
                    if (room.onlinePlayers.has(playerId)) {
                        room.spectators.add(playerId)
                        updateState()
                    }
                }
            }
            // panika step
            const calcNextCardPanika = () => {
                return state.deck.length > 0 ? state.deck[0].type === utils.cardTypes.panika : null
            }
            const calcPrevCardPanika = () => {
                return state.discard.length > 0
                    ? state.discard[state.discard.length - 1].type === utils.cardTypes.panika : null
            }
            const starieVerevkiPanika = () => {
                Object.keys(room.karantin).forEach(() => pushDiscardKarantin())
                room.karantin = {}
                room.currentPanika = null
                update()
                updateState()
                startObmen()
            }
            const triChetyrePanika = () => {
                for (let i = room.dveri.length; i > 0; i--) {
                    pushDiscardDver()
                }
                room.dveri = []
                room.currentPanika = null
                startObmen()
            }
            const uuupsPanika = () => {
                room.showAllHand = state.playerHand[room.currentPlayer]
                startTimer()
                update()
                updateState()
            }
            const iViEtoNazivaeteVecherinkoyPanika = () => {
                room.dveri.forEach(() => pushDiscardDver())
                room.dveri = []
                Object.keys(room.karantin).forEach(() => pushDiscardKarantin())
                room.karantin = {}
                update()
                updateState()

                const chasovayaStrelka = false
                let kolvoSmen = Math.floor(Object.keys(state.playerHand).length / 2)
                let firstChel = room.currentPlayer
                let vtoroyChel = getNextPlayer(chasovayaStrelka, firstChel)
                while (kolvoSmen--) {
                    smenaMest(firstChel, vtoroyChel)
                    firstChel = getNextPlayer(chasovayaStrelka, vtoroyChel)
                    vtoroyChel = getNextPlayer(chasovayaStrelka, firstChel)
                }
                update()
                updateState()
            }
            const razDvaPanika = (target) => {
                if (target !== null && !room.karantin[target] && getThirdPlayers().includes(target)) {
                    room.target = target
                    resolvePassAction()
                }
            }
            const ubiraysyaProchPanika = (target, slot) => {
                smenaMest(slot, target)
                room.currentPanika = null
                update()
                updateState()
                startObmen()
            }
            const tolkoMejduNamiPanika = (slot, target) => {
                state.showCard[target] = state.playerHand[slot]
                room.target = target
                room.waitMoveSlot = room.target
                room.gameLog.push({
                    action: 'pokaz',
                    actors: [room.playerSlots[room.currentPlayer], room.playerSlots[room.target]],
                })
                startTimer()
                update()
                updateState()
            }
            const davaiDrujitPanika = (slot, target, index) => {
                if (!room.karantin[target]) {
                    if (slot === room.currentPlayer && !room.isObmenReady) {
                        if (obmenChekZarajeniy(slot, index, target)) {
                            room.target = target
                            state.obmenCardIndex = index
                            room.isObmenReady = true
                            room.waitMoveSlot = room.target
                            startTimer()
                            update()
                            updateState()
                        }
                    } else if (slot === room.target) {
                        if (obmenChekZarajeniy(slot, index, target)) {
                            obmenProcces(index)
                        }
                    }
                } else {
                    room.gameLog.push({
                        action: 'ne-obmen',
                        actors: [room.playerSlots[room.currentPlayer], room.playerSlots[target]],
                    })
                    notEndRound()
                }
            }
            const startTsepnayaReaksia = () => {
                room.readyPlayers = {}
                Object.keys(state.playerHand).map(Number).forEach(slot => {
                    const karta1 = state.playerHand[slot][state.tsepnayaReaksiaObmenKard[slot]]
                    const nextPlayer = getNextPlayer(room.invertDirection, slot)
                    if (karta1.id === utils.cardsDeck.zarajenie.id && slot === state.nechto && !state.zarajennie.includes(nextPlayer)) {
                        state.zarajennie.push(nextPlayer)
                    }
                    state.playerHand[nextPlayer].push(karta1)
                    state.playerHand[slot].splice(state.tsepnayaReaksiaObmenKard[slot], 1)
                })
                Object.keys(state.playerHand).map(Number).forEach(slot => {
                    processKrinj(slot)
                })
                room.currentPanika = null
                endRound()
            }
            const tsepnayaReaksiaPanika = (slot, index) => {
                if (obmenChekZarajeniy(slot, index, getNextPlayer(room.invertDirection, slot))) {
                    state.tsepnayaReaksiaObmenKard[slot] = index
                    room.readyPlayers[slot] = true
                    if (isAllPlayersReady()) {
                        startTsepnayaReaksia()
                    } else {
                        updatePlayerState(room.playerSlots[slot])
                    }
                    update()
                }
            }
            const svidanieVSlepuyuPanika = (slot, index) => {
                grabNewCard(slot)
                state.deck.unshift(getHandCard(slot, index))
                state.playerHand[slot].splice(index, 1)
                room.currentPanika = null
                endRound()
            }
            const zabivchivostChekCard = (slot) => {
                const ruka = [...state.playerHand[slot]]
                let result

                if (slot === state.nechto) {
                    result = indexesHandWithoutNechto(ruka)
                } else if (state.zarajennie.includes(slot)) {
                    result = indexesHandWithoutZarajenie(ruka)
                } else {
                    result = ruka.map((card, index) => index)
                }

                if (result.length < 3) {
                    pizdets()
                }
                result = utils.shuffleArray(result)
                zabivchivostPanika(slot, result[0], result[1], result[2])
            }
            const zabivchivostPanika = (slot, index1, index2, index3, isCringe) => {
                if (new Set([index1, index2, index3]).size === 3) {
                    if (!state.zarajennie.includes(slot) || isCringe) {
                        if (
                            slot === room.currentPlayer
                            && [index1, index2, index3].every(
                                (ind) => [0, 1, 2, 3].includes(ind) && state.playerHand[slot][ind].id !== utils.cardsDeck.nechto.id,
                            )
                        ) {
                            state.discard.push(state.playerHand[slot][index1])
                            state.discard.push(state.playerHand[slot][index2])
                            state.discard.push(state.playerHand[slot][index3])
                            const sortedIndices = [index1, index2, index3].sort((a, b) => a - b)
                            state.playerHand[slot].splice(sortedIndices[2], 1)
                            state.playerHand[slot].splice(sortedIndices[1], 1)
                            state.playerHand[slot].splice(sortedIndices[0], 1)
                            state.playerHand[slot].push(dealNewCard(slot))
                            state.playerHand[slot].push(dealNewCard(slot))
                            state.playerHand[slot].push(dealNewCard(slot))
                            room.currentPanika = null
                            update()
                            updateState()
                            startObmen()
                        }
                    } else {
                        const result = utils.shuffleArray(indexesHandWithoutZarajenie(state.playerHand[slot]))
                        zabivchivostPanika(slot, result[0], result[1], result[2], true)
                    }
                }
            }
            const vremyaPriznaniyPanika = () => {
                room.vremyaPriznaniySlot = room.currentPlayer
                room.waitMoveSlot = room.vremyaPriznaniySlot
                startTimer()
                update()
                updateState()
            }

            this.userJoin = userJoin
            this.userLeft = userLeft
            this.userEvent = userEvent
            this.slotEventHandlers = {
                'grab-card': (slot) => {
                    if (room.currentPlayer === slot && room.phase === 1) {
                        grabCard()
                    }
                    update()
                    updateState()
                },
                'drop-card': (slot, index) => {
                    if (room.currentPlayer === slot && room.phase === 2 && room.action === null && [0, 1, 2, 3, 4].includes(index)) {
                        if (chekDropCard(slot, index)) {
                            state.discard.push(...state.playerHand[slot].splice(index, 1))
                            room.gameLog.push({ action: 'drop-card', actors: [room.playerSlots[room.currentPlayer]] })
                            startObmen()
                        } else {
                            update()
                            updateState()
                        }
                    }
                },
                'play-card': (slot, index, target) => {
                    if (
                        (room.phase === 2 || room.action)
                        && room.currentPlayer === slot
                        && !room.karantin[slot]
                        && [0, 1, 2, 3, 4].includes(index)
                        && Object.keys(state.playerHand[slot]).length === 5
                    ) {
                        const card = getHandCard(slot, index)
                        const sigrat = () => {
                            state.discard.push(card)
                            state.playerHand[slot].splice(index, 1)
                        }
                        const logs = (target) => {
                            target = target ?? room.target
                            room.gameLog.push({
                                card: card,
                                actors: [room.playerSlots[room.currentPlayer], (target !== undefined && target !== null) ? room.playerSlots[target] : null],
                            })
                        }
                        const nextPlayer = getNextPlayer(room.invertDirection)
                        const prevPLayer = getNextPlayer(!room.invertDirection)
                        const gagagaTargetHand = state.playerHand[target]
                        if (card.target === utils.targets.any.id && target !== null && gagagaTargetHand) {
                            if (!room.karantin[target]) {
                                if (card.id === utils.cardsDeck.smativayUdochki.id) {
                                    room.action = utils.cardsDeck.smativayUdochki.id
                                    room.waitMoveSlot = target
                                    room.target = target
                                    sigrat()
                                    logs(target)
                                    startTimer()
                                    update()
                                    updateState()
                                } else if (card.id === utils.cardsDeck.soblazn.id) {
                                    room.action = utils.cardsDeck.soblazn.id
                                    room.target = target
                                    sigrat()
                                    logs(target)
                                    startTimer()
                                    update()
                                    updateState()
                                }
                            }
                        } else if (card.target === utils.targets.sosed.id && (prevPLayer === target || nextPlayer === target) && gagagaTargetHand) {
                            if (card.id === utils.cardsDeck.topor.id) {
                                if (!isDoorMissing(target)) {
                                    room.dveri.splice(room.dveri.indexOf(getNextPlayer(true, slot) === target ? target : slot), 1)
                                    logs(target)
                                    sigrat()
                                    pushDiscardDver()
                                    startObmen()
                                } else if (room.karantin[target]) {
                                    delete room.karantin[target]
                                    logs(target)
                                    sigrat()
                                    pushDiscardKarantin()
                                    startObmen()
                                }
                            } else if (card.id === utils.cardsDeck.zakolchennayDver.id) {
                                if (isDoorMissing(target)) {
                                    room.dveri.push(getNextPlayer(true, slot) === target ? target : slot)
                                    logs(target)
                                    state.playerHand[slot].splice(index, 1)
                                    startObmen()
                                }
                            } else if (!room.karantin[target] && isDoorMissing(target)) {
                                if (card.id === utils.cardsDeck.ognemet.id) {
                                    room.action = utils.cardsDeck.ognemet.id
                                    room.target = target
                                    room.waitMoveSlot = target
                                    sigrat()
                                    logs(target)
                                    startTimer()
                                    update()
                                    updateState()
                                } else if (card.id === utils.cardsDeck.analiz.id) {
                                    room.action = utils.cardsDeck.analiz.id
                                    room.target = target
                                    logs(target)
                                    state.showCard[room.currentPlayer] = state.playerHand[room.target]
                                    sigrat()
                                    startTimer()
                                    update()
                                    updateState()
                                } else if (card.id === utils.cardsDeck.podozrenie.id) {
                                    room.action = utils.cardsDeck.podozrenie.id
                                    room.target = target
                                    room.waitMoveSlot = room.currentPlayer
                                    logs(target)
                                    sigrat()
                                    const showedCard = [state.playerHand[room.target][utils.shuffleArray([0, 1, 2, 3])[0]]]
                                    state.showCard[room.currentPlayer] = showedCard
                                    state.showCard[room.target] = showedCard
                                    startTimer()
                                    update()
                                    updateState()
                                } else if (card.id === utils.cardsDeck.menyaemsyaMestami.id) {
                                    room.action = utils.cardsDeck.menyaemsyaMestami.id
                                    room.target = target
                                    room.waitMoveSlot = target
                                    sigrat()
                                    logs(target)
                                    startTimer()
                                    update()
                                    updateState()
                                }
                            }
                        } else if (card.target === utils.targets.selfOrSosed.id && [prevPLayer, nextPlayer, slot].includes(target) && gagagaTargetHand) {
                            if (card.id === utils.cardsDeck.karantin.id) {
                                if ((isDoorMissing(target) && !room.karantin[target]) || slot === target) {
                                    room.target = target
                                    room.karantin[target] = 2
                                    state.playerHand[slot].splice(index, 1)
                                    flags.selfKarantin = true
                                    logs(target)
                                    startObmen()
                                }
                            }
                        } else {
                            if (card.id === utils.cardsDeck.uporstvo.id) {
                                room.action = utils.cardsDeck.uporstvo.id
                                room.target = null
                                logs()
                                sigrat()
                                state.uporstvoCards = [dealNewCard(), dealNewCard(), dealNewCard()]
                                state.showCard[slot] = state.uporstvoCards
                                startTimer()
                                update()
                                updateState()
                            } else if (card.id === utils.cardsDeck.glyadiPoStoronam.id) {
                                room.invertDirection = !room.invertDirection
                                logs()
                                sigrat()
                                startObmen()
                            } else if (card.id === utils.cardsDeck.viski.id) {
                                room.showAllHand = state.playerHand[room.currentPlayer]
                                room.action = utils.cardsDeck.viski.id
                                logs()
                                sigrat()
                                startTimer()
                                update()
                                updateState()
                            }
                        }
                    }
                },
                'resolve-soblazn': (slot, index) => {
                    if (
                        slot === room.target && [0, 1, 2, 3].includes(index)
                        && room.action === utils.cardsDeck.soblazn.id
                        && room.isObmenReady
                        && obmenChekZarajeniy(slot, index, room.currentPlayer)
                    ) {
                        obmenProcces(index)
                    }
                },
                'resolve-obmen': (slot, index) => {
                    if (slot === room.target && [0, 1, 2, 3].includes(index)) {
                        if (room.isObmenReady && obmenChekZarajeniy(slot, index, room.currentPlayer)) {
                            room.gameLog.push({ actors: room.currentPlayer, act: 'resolve-obmenivatsa' })
                            obmenProcces(index)
                        }
                    }
                },
                'vilojit-kartu-na-obmen': (slot, index) => {
                    if (slot === room.currentPlayer && [0, 1, 2, 3].includes(index) && obmenChekZarajeniy(slot, index, room.target)) {
                        room.isObmenReady = true
                        state.obmenCardIndex = index
                        room.showAllHand = null
                        room.waitMoveSlot = room.target
                        room.gameLog.push({ actors: room.currentPlayer, act: 'start-obmenivatsa' })
                        startTimer()
                        update()
                        updateState()
                    }
                },
                'resolve-action': (slot, index) => {
                    let gagagaTargetHand
                    const card = getHandCard(slot, index)
                    if (room.action !== utils.cardsDeck.uporstvo.id) {
                        gagagaTargetHand = state.playerHand[room.target]
                    }
                    if ([0, 1, 2, 3].includes(index) && slot === room.target && gagagaTargetHand) {
                        const sigrat = () => {
                            state.discard.push(card)
                            state.playerHand[room.target].splice(index, 1)
                            grabNewCard(room.target)
                        }
                        const logsOne = () => {
                            room.gameLog.push({ card: card, actors: [room.playerSlots[room.target]] })
                        }
                        if (room.action === utils.cardsDeck.ognemet.id) {
                            if (card.id === utils.cardsDeck.nikakogoShahlika.id) {
                                room.waitMoveSlot = room.currentPlayer
                                logsOne()
                                sigrat()
                                startObmen()
                            }
                        } else if (room.action === utils.cardsDeck.menyaemsyaMestami.id || room.action === utils.cardsDeck.smativayUdochki.id) {
                            if (card.id === utils.cardsDeck.mneIZdesNePloha.id) {
                                room.waitMoveSlot = room.currentPlayer
                                sigrat()
                                logsOne()
                                startObmen()
                            }
                        } else if (
                            room.phase === 3 || room.action === utils.cardsDeck.soblazn.id
                            || room.currentPanika?.id === utils.cardsDeck.davaiDrujit.id
                        ) {
                            if (
                                (card.id === utils.cardsDeck.mimo.id && room.target !== state.nechto)
                                || (card.id === utils.cardsDeck.mimo.id && room.target === state.nechto && !state.zarajennie.includes(room.currentPlayer))
                            ) {
                                logsOne()
                                sigrat()
                                room.target = getNextPlayer(room.invertDirection, room.target)
                                if (
                                    isDoorMissing(room.target, getNextPlayer(!room.invertDirection, room.target))
                                    && !room.karantin[room.target] && room.target !== room.currentPlayer
                                ) {
                                    room.waitMoveSlot = room.target
                                    startTimer()
                                    update()
                                    updateState()
                                } else {
                                    endRound()
                                }
                            } else if (card.id === utils.cardsDeck.strah.id) {
                                sigrat()
                                logsOne()
                                state.showCard[room.target] = [state.playerHand[room.currentPlayer][state.obmenCardIndex]]
                                room.action = utils.cardsDeck.strah.id
                                room.waitMoveSlot = room.target
                                startTimer()
                                update()
                                updateState()
                            } else if (card.id === utils.cardsDeck.netUjSpasibo.id) {
                                room.waitMoveSlot = room.currentPlayer
                                logsOne()
                                sigrat()
                                if (room.currentPanika?.id === utils.cardsDeck.davaiDrujit.id) {
                                    notEndRound()
                                } else {
                                    endRound()
                                }
                            }
                        }
                    } else if (slot === room.currentPlayer && room.action === utils.cardsDeck.soblazn.id) {
                        if (obmenChekZarajeniy(slot, index, room.target)) {
                            state.obmenCardIndex = index
                            room.isObmenReady = true
                            room.waitMoveSlot = room.target
                            startTimer()
                            update()
                            updateState()

                        }
                    } else if (room.action === utils.cardsDeck.uporstvo.id) {
                        if (slot === room.currentPlayer && [0, 1, 2].includes(index)) {
                            let nechtoIndex = state.uporstvoCards.findIndex(c => c.id === utils.cardsDeck.nechto.id)
                            if (nechtoIndex === -1) {
                                state.playerHand[slot].push(...state.uporstvoCards.splice(index, 1))
                                state.discard.push(...state.uporstvoCards)
                            } else if (nechtoIndex === index) {
                                state.playerHand[slot].push(...state.uporstvoCards.splice(index, 1))
                                state.discard.push(...state.uporstvoCards)
                            } else {
                                return false
                            }
                            room.action = null
                            state.showCard = {}
                            room.action = null
                            startTimer()
                            update()
                            updateState()
                        }
                    }
                },
                'resolve-pass-action': (slot) => {
                    if (
                        ([utils.cardsDeck.podozrenie.id, utils.cardsDeck.analiz.id].includes(room.action) && slot === room.currentPlayer)
                        || slot === room.target || slot === room.vremyaPriznaniySlot
                    ) {
                        resolvePassAction()
                    }
                },
                'panic-action': (slot, target, index, index1, index2, index3) => {
                    const panika = room.currentPanika
                    if (room.phase === 2 && panika && panika.type === utils.cardTypes.panika) {
                        if (panika.id === utils.cardsDeck.iViEtoNazivaeteVecherinkoy.id) {
                            iViEtoNazivaeteVecherinkoyPanika()
                            room.currentPanika = null
                            startObmen()
                        } else if (panika.id === utils.cardsDeck.razDva.id) {
                            razDvaPanika(target)
                        } else if (panika.id === utils.cardsDeck.ubiraysyaProch.id) {
                            if (target !== null && state.playerHand[target] && !room.karantin[target] && target !== room.currentPlayer) {
                                room.target = target
                                ubiraysyaProchPanika(target, slot)
                            }
                        } else if (panika.id === utils.cardsDeck.starieVerevki.id) {
                            starieVerevkiPanika()
                        } else if (panika.id === utils.cardsDeck.tolkoMejduNami.id) {
                            if (target !== null && getSosedPlayers().includes(target)) {
                                tolkoMejduNamiPanika(slot, target)
                            }
                        } else if (panika.id === utils.cardsDeck.davaiDrujit.id) {
                            if ((target !== null && index !== null && slot === room.currentPlayer) || slot === room.target) {
                                davaiDrujitPanika(slot, target, index)
                            }
                        } else if (panika.id === utils.cardsDeck.vremyaPriznaniy.id) {
                            if (room.vremyaPriznaniySlot === null) {
                                vremyaPriznaniyPanika()
                                return
                            }
                            const showHand = [...new Set([index, index1, index2, index3].filter(index => index !== null))].sort((a, b) => a - b)
                            const playerHand = state.playerHand[room.vremyaPriznaniySlot]
                            const zHand = playerHand.map((card, index) => card.id === utils.cardsDeck.zarajenie.id ? index : null).filter(index => index !== null)
                            if (
                                showHand.length === 0
                                || (showHand.length < 4 && zHand.length === 0)
                                || !showHand.every(index => [0, 1, 2, 3].includes(index))
                                || (zHand.length !== 0 && !zHand.some(index => showHand.includes(index)))
                            ) {
                                return
                            }
                            room.showAllHand = showHand.map(index => playerHand[index])
                            if (zHand.length > 0 || room.vremyaPriznaniySlot === getNextPlayer(!room.invertDirection, room.currentPlayer)) {
                                flags.vremyaPriznaniyEnd = true
                            }
                            startTimer()
                            update()
                            updateState()
                        } else if (panika.id === utils.cardsDeck.tsepnayaReaksia.id) {
                            if ([0, 1, 2, 3].includes(index) && !state.tsepnayaReaksiaObmenKard[slot])
                                tsepnayaReaksiaPanika(slot, index)
                        } else if (panika.id === utils.cardsDeck.triChetyre.id) {
                            triChetyrePanika()
                        } else if (panika.id === utils.cardsDeck.uups.id) {
                            if (!room.showAllHand) {
                                uuupsPanika()
                            }
                        } else if (panika.id === utils.cardsDeck.svidanieVSlepuyu.id) {
                            const card = getHandCard(slot, index)
                            if (
                                index !== null && card.id !== utils.cardsDeck.nechto.id &&
                                (card.id !== utils.cardsDeck.zarajenie.id || !state.zarajennie.includes(slot) || calcZarajenieCount(slot) > 1)
                            ) {
                                svidanieVSlepuyuPanika(slot, index)
                            }
                        } else if (panika.id === utils.cardsDeck.zabivchivost.id) {
                            zabivchivostPanika(slot, index1, index2, index3)
                        }
                    }
                },
            }
            this.userEventHandlers = {
                ...this.eventHandlers,
                'start-game': (user) => {
                    if (user === room.hostId && room.phase === 0) {
                        startGame()
                    }
                },
                'abort-game': (user) => {
                    if (user === room.hostId) {
                        if (room.phase === 0) {
                            resetStol()
                            update()
                            updateState()
                        } else {
                            endGame()
                        }
                    }
                },
                'toggle-lock': (user) => {
                    if (user === room.hostId) {
                        room.teamsLocked = !room.teamsLocked
                        update()
                    }
                },
                'players-join': (user, slot) => {
                    if (!room.teamsLocked && room.playerSlots[slot] === null) {
                        if (~room.playerSlots.indexOf(user)) {
                            room.playerSlots[room.playerSlots.indexOf(user)] = null
                        }
                        room.playerSlots[slot] = user
                        room.spectators.delete(user)
                        update()
                        updateState()
                    }
                },
                'start-with-nechto': (user) => {
                    if (room.hostId === user && room.phase === 0) {
                        room.startWithNechto = !room.startWithNechto
                        if (room.startWithNechto) {
                            room.gameLog.push({ action: 'С Нечто в стартовых руках' })
                        } else {
                            room.gameLog.push({ action: 'С Нечто в колоде' })
                        }
                        update()
                    }
                },
                'spectators-join': (user) => {
                    if (!room.teamsLocked && ~room.playerSlots.indexOf(user)) {
                        room.playerSlots[room.playerSlots.indexOf(user)] = null
                        room.spectators.add(user)
                        update()
                        updateState()
                    }
                },
                'give-host': (user, playerId) => {
                    if (room.hostId === user && playerId && user !== playerId) {
                        room.hostId = playerId
                        this.emit('host-changed', user, playerId)
                        update()
                    }
                },
                'remove-player': (user, playerId) => {
                    if (room.hostId === user && playerId !== null) {
                        removePlayer(playerId)
                        update()
                        updateState()
                    }
                },
                'update-avatar': (user, id) => {
                    room.playerAvatars[user] = id
                    update()
                },
                'shuffle-players': (user) => {
                    if (room.hostId === user && room.phase === 0) {
                        shufflePlayerSLots()
                        resetStol()
                        update()
                        updateState()
                    }
                },
                'toggle-pause': (user) => {
                    if (user === room.hostId) {
                        room.paused = !room.paused
                        if (!room.paused) {
                            startTimer()
                        }
                        update()
                    }
                },
                'set-timer': (user, smallTimer, bigTimer) => {
                    if (user === room.hostId) {
                        room.smallTimer = smallTimer
                        room.bigTimer = bigTimer
                        update()
                    }
                },
            }
        }


        getPlayerCount() {
            return Object.keys(this.room.playerNames).length
        }

        getActivePlayerCount() {
            return this.room.onlinePlayers.size
        }

        getLastInteraction() {
            return this.lastInteraction
        }

        getSnapshot() {
            return {
                room: this.room,
                state: this.state,
            }
        }

        setSnapshot(snapshot) {
            Object.assign(this.room, snapshot.room)
            Object.assign(this.state, snapshot.state)
            this.room.onlinePlayers = new JSONSet()
            this.room.spectators = new JSONSet()
            this.room.onlinePlayers.clear()
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

    registry.createRoomManager(path, GameState)
}

module.exports = init