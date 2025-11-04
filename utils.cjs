const cardTypes = {
    panika: {},
    card: {},
}

for (let card in cardTypes) {
    cardTypes[card].id = card
}

const targets = {
    sosed: {},
    selfOrSosed: {},
    any: {},
}

for (let target in targets) {
    targets[target].id = target
}

const cardsDeck = {
    ognemet: {
        type: cardTypes.card.id, target: targets.sosed.id,
        count: { 4: 2, 5: 2, 6: 3, 7: 3, 8: 3, 9: 4, 10: 4, 11: 5, 12: 5 },
    },
    analiz: {
        type: cardTypes.card.id, target: targets.sosed.id, allReady: true,
        count: { 4: 0, 5: 1, 6: 2, 7: 2, 8: 2, 9: 3, 10: 3, 11: 3, 12: 3 },
    },
    topor: {
        type: cardTypes.card.id, target: targets.sosed.id,
        count: { 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 2, 10: 2, 11: 2, 12: 2 },
    },
    podozrenie: {
        type: cardTypes.card.id, target: targets.sosed.id,
        count: { 4: 4, 5: 4, 6: 4, 7: 5, 8: 6, 9: 7, 10: 8, 11: 8, 12: 8 },
    },
    viski: {
        type: cardTypes.card.id,
        count: { 4: 1, 5: 1, 6: 2, 7: 2, 8: 2, 9: 2, 10: 3, 11: 3, 12: 3 },
    },
    uporstvo: {
        type: cardTypes.card.id,
        count: { 4: 2, 5: 2, 6: 3, 7: 3, 8: 3, 9: 3, 10: 4, 11: 4, 12: 4 },
    },
    glyadiPoStoronam: {
        type: cardTypes.card.id,
        count: { 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 2, 10: 2, 11: 2, 12: 2 },
    },
    menyaemsyaMestami: {
        type: cardTypes.card.id, target: targets.sosed.id, action: true,
        count: { 4: 2, 5: 2, 6: 2, 7: 3, 8: 3, 9: 4, 10: 4, 11: 5, 12: 5 },
    },
    smativayUdochki: {
        type: cardTypes.card.id, target: targets.any.id, action: true,
        count: { 4: 2, 5: 2, 6: 2, 7: 3, 8: 3, 9: 3, 10: 3, 11: 4, 12: 4 },
    },
    soblazn: {
        type: cardTypes.card.id, endTurn: true, target: targets.any.id, action: true,
        count: { 4: 2, 5: 2, 6: 3, 7: 4, 8: 5, 9: 5, 10: 6, 11: 7, 12: 7 },
    },
    strah: {
        type: cardTypes.card.id,
        count: { 4: 0, 5: 1, 6: 2, 7: 2, 8: 3, 9: 3, 10: 3, 11: 4, 12: 4 },
    },
    mneIZdesNePloha: {
        type: cardTypes.card.id,
        count: { 4: 1, 5: 1, 6: 2, 7: 2, 8: 2, 9: 2, 10: 2, 11: 3, 12: 3 },
    },
    netUjSpasibo: {
        type: cardTypes.card.id,
        count: { 4: 1, 5: 1, 6: 2, 7: 2, 8: 3, 9: 3, 10: 3, 11: 4, 12: 4 },
    },
    mimo: {
        type: cardTypes.card.id,
        count: { 4: 1, 5: 1, 6: 2, 7: 2, 8: 2, 9: 2, 10: 2, 11: 3, 12: 3 },
    },
    nikakogoShahlika: {
        type: cardTypes.card.id,
        count: { 4: 1, 5: 1, 6: 2, 7: 2, 8: 2, 9: 2, 10: 2, 11: 3, 12: 3 },
    },
    karantin: {
        type: cardTypes.card.id, target: targets.selfOrSosed.id,
        count: { 4: 0, 5: 1, 6: 1, 7: 1, 8: 1, 9: 2, 10: 2, 11: 2, 12: 2 },
    },
    zakolchennayDver: {
        type: cardTypes.card.id, target: targets.sosed.id,
        count: { 4: 1, 5: 1, 6: 1, 7: 2, 8: 2, 9: 2, 10: 2, 11: 3, 12: 3 },
    },
    iViEtoNazivaeteVecherinkoy: {
        type: cardTypes.panika, allReady: true,
        count: { 4: 0, 5: 1, 6: 1, 7: 1, 8: 1, 9: 2, 10: 2, 11: 2, 12: 2 },
    },
    razDva: {
        type: cardTypes.panika,
        count: { 4: 0, 5: 1, 6: 1, 7: 1, 8: 1, 9: 2, 10: 2, 11: 2, 12: 2 },
    },
    ubiraysyaProch: {
        type: cardTypes.panika, target: targets.any.id,
        count: { 4: 0, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1, 10: 1, 11: 1, 12: 1 },
    },
    starieVerevki: {
        type: cardTypes.panika,
        count: { 4: 0, 5: 0, 6: 1, 7: 1, 8: 1, 9: 2, 10: 2, 11: 2, 12: 2 },
    },
    tolkoMejduNami: {
        type: cardTypes.panika, target: targets.sosed.id,
        count: { 4: 0, 5: 0, 6: 0, 7: 1, 8: 1, 9: 2, 10: 2, 11: 2, 12: 2 },
    },
    davaiDrujit: {
        type: cardTypes.panika, target: targets.any.id,
        count: { 4: 0, 5: 0, 6: 0, 7: 1, 8: 1, 9: 2, 10: 2, 11: 2, 12: 2 },
    },
    vremyaPriznaniy: {
        type: cardTypes.panika,
        count: { 4: 0, 5: 0, 6: 0, 7: 0, 8: 1, 9: 1, 10: 1, 11: 1, 12: 1 },
    },
    tsepnayaReaksia: {
        type: cardTypes.panika, endTurn: true, allReady: true,
        count: { 4: 0, 5: 1, 6: 1, 7: 1, 8: 1, 9: 2, 10: 2, 11: 2, 12: 2 },
    },
    triChetyre: {
        type: cardTypes.panika,
        count: { 4: 0, 5: 1, 6: 1, 7: 1, 8: 1, 9: 2, 10: 2, 11: 2, 12: 2 },
    },
    uups: {
        type: cardTypes.panika, target: targets.sosed.id,
        count: { 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 1, 12: 1 },
    },
    svidanieVSlepuyu: {
        type: cardTypes.panika, endTurn: true,
        count: { 4: 0, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1, 10: 2, 11: 2, 12: 2 },
    },
    zabivchivost: {
        type: cardTypes.panika,
        count: { 4: 0, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1, 10: 1, 11: 1, 12: 1 },
    },
    zarajenie: {
        type: cardTypes.card.id,
        count: { 4: 8, 5: 9, 6: 12, 7: 13, 8: 15, 9: 16, 10: 19, 11: 19, 12: 19 },
    },
    nechto: {
        type: cardTypes.card.id, giveAble: false,
        count: { 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1, 10: 1, 11: 1, 12: 1 },
    },
}

for (let card in cardsDeck) {
    cardsDeck[card].id = card
}

const createDeck = (players, startWithNechto, testMode) => {
    if (testMode) {
        const testDeck = Array(8).fill(NaN).map(_ => ({ ...cardsDeck.zarajenie }))
        const testDeck2 = Array(8).fill(NaN).map(_ => ({ ...cardsDeck.ognemet }))
        const testDeck3 = Array(4).fill(NaN).map(_ => ({ ...cardsDeck.ognemet }))
        return [
            ...shuffleArray([...testDeck, ...testDeck2, ...testDeck3]),
            ...[cardsDeck.zabivchivost],
            ...[cardsDeck.nechto],
            ...[cardsDeck.zarajenie],
            ...[cardsDeck.zarajenie],
            ...[cardsDeck.zarajenie],
            ...[cardsDeck.zarajenie],
            ...[cardsDeck.zarajenie],
        ]
    }

    let deck = [], playersCardWillbe = players * 4 - 1, result = []
    for (let card in cardsDeck) {
        const cardCount = cardsDeck[card].count[players]
        deck.push({
            card: card,
            cardFull: cardsDeck[card],
            count: cardCount,
            type: cardsDeck[card].type,
        })
    }
    let realdeck = []
    let zCount = shuffleArray(new Array(19).fill().map((it, ind) => ind))
    deck.forEach(el => {
        for (let i = 0; i < el.count; i++) {
            let cardFull = el.cardFull
            if (cardFull.id === cardsDeck.zarajenie.id) {
                cardFull = { ...cardFull }
                cardFull.zNumber = zCount.pop()
            }
            realdeck.push(cardFull)
        }
    })
    let newDeck = realdeck.filter(card => card.id !== cardsDeck.zarajenie.id && card.type === cardTypes.card.id && card.id !== cardsDeck.nechto.id)
    let panikDeck = realdeck.filter(card => card.type === cardTypes.panika)
    let zarajenieDeck = realdeck.filter(card => card.id === cardsDeck.zarajenie.id)
    let nechtoDeck = realdeck.filter(card => card.id === cardsDeck.nechto.id)
    let shuffledDeck = shuffleArray([...newDeck])
    if (startWithNechto) {
        let shuffleArrayNechto = [...shuffledDeck].splice(0, playersCardWillbe)
        shuffleArrayNechto.push(...nechtoDeck)
        shuffleArray(shuffleArrayNechto)
        let shuffleOstatok = shuffleArray(shuffledDeck.splice(playersCardWillbe, shuffledDeck.length - 1))
        let ostatokDeck = shuffleArray([...shuffleOstatok, ...zarajenieDeck, ...panikDeck])
        result = [...shuffleArrayNechto, ...ostatokDeck]
    } else {
        let firstdeckgo = [...shuffledDeck].splice(0, playersCardWillbe + 1)
        let shufledFirsDeck = shuffleArray(firstdeckgo)
        let ostatokDeck = shuffledDeck.splice(playersCardWillbe + 1, shuffledDeck.length - 1)
        ostatokDeck.push(...nechtoDeck)
        let shuffleDeki = shuffleArray([...ostatokDeck, ...panikDeck, ...zarajenieDeck])
        result = [...shufledFirsDeck, ...shuffleDeki]
    }

    return result
}

function shuffleArray(array) {
    let currentIndex = array.length, temporaryValue, randomIndex
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1
        temporaryValue = array[currentIndex]
        array[currentIndex] = array[randomIndex]
        array[randomIndex] = temporaryValue
    }
    return array
}

const getUniqueDistricts = () => {
    return Object.keys(districts).filter((district) => districts[district].type === 9)
}

module.exports = {
    cardsDeck,
    cardTypes,
    targets,
    createDeck,
    getUniqueDistricts,
    shuffleArray,
}
