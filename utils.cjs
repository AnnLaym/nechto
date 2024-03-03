const cardsDeck = {
    ognemet: {
        type: "card", isAttacking: true, isDefending: false, target: 'sosed', action: true, smallTimer: true,
        count: { 4: 2, 5: 2, 6: 3, 7: 3, 8: 3, 9: 4, 10: 4, 11: 5, 12: 5 }
    },
    analiz: {
        type: "card", isAttacking: false, isDefending: false, target: 'sosed', action: true, allReady: true,
        count: { 4: 0, 5: 1, 6: 2, 7: 2, 8: 2, 9: 3, 10: 3, 11: 3, 12: 3 }
    },
    topor: {
        type: "card", isAttacking: false, isDefending: false, target: 'selfOrSosed', action: true,
        count: { 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 2, 10: 2, 11: 2, 12: 2 }
    },
    podozrenie: {
        type: "card", isAttacking: true, isDefending: false, target: 'sosed', action: true,
        count: { 4: 4, 5: 4, 6: 4, 7: 5, 8: 6, 9: 7, 10: 8, 11: 8, 12: 8 }
    },
    viski: {
        type: "card", isAttacking: false, isDefending: false, action: true,
        count: { 4: 1, 5: 1, 6: 2, 7: 2, 8: 2, 9: 2, 10: 3, 11: 3, 12: 3 }
    },
    uporstvo: {
        type: "card", isAttacking: false, isDefending: false, action: true,
        count: { 4: 2, 5: 2, 6: 3, 7: 3, 8: 3, 9: 3, 10: 4, 11: 4, 12: 4 }
    },
    glyadiPoStoronam: {
        type: "card", isAttacking: false, isDefending: false, action: true,
        count: { 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 2, 10: 2, 11: 2, 12: 2 }
    },
    menyaemsyaMestami: {
        type: "card", isAttacking: true, isDefending: false, target: 'sosed', action: true,
        count: { 4: 2, 5: 2, 6: 2, 7: 3, 8: 3, 9: 4, 10: 4, 11: 5, 12: 5 }
    },
    smaivayUdochki: {
        type: "card", isAttacking: true, isDefending: false, target: 'any', action: true,
        count: { 4: 2, 5: 2, 6: 2, 7: 3, 8: 3, 9: 3, 10: 3, 11: 4, 12: 4 }
    },
    soblazn: {
        type: "card", isAttacking: true, isDefending: false, endTurn: true, target: 'any', action: true, endTurn: true,
        count: { 4: 2, 5: 2, 6: 3, 7: 4, 8: 5, 9: 5, 10: 6, 11: 7, 12: 7 }
    },
    strah: {
        type: "card", isAttacking: false, isDefending: true,
        count: { 4: 0, 5: 1, 6: 2, 7: 2, 8: 3, 9: 3, 10: 3, 11: 4, 12: 4 }
    },
    mneIZdesNePloha: {
        type: "card", isAttacking: false, isDefending: true,
        count: { 4: 1, 5: 1, 6: 2, 7: 2, 8: 2, 9: 2, 10: 2, 11: 3, 12: 3 }
    },
    netUjSpasibo: {
        type: "card", isAttacking: false, isDefending: true,
        count: { 4: 1, 5: 1, 6: 2, 7: 2, 8: 3, 9: 3, 10: 3, 11: 4, 12: 4 }
    },
    mimo: {
        type: "card", isAttacking: false, isDefending: true,
        count: { 4: 1, 5: 1, 6: 2, 7: 2, 8: 2, 9: 2, 10: 2, 11: 3, 12: 3 }
    },
    nikakogoShahlika: {
        type: "card", isAttacking: false, isDefending: true,
        count: { 4: 1, 5: 1, 6: 2, 7: 2, 8: 2, 9: 2, 10: 2, 11: 3, 12: 3 }
    },
    karantin: {
        type: "card", isAttacking: false, isDefending: true, target: 'selfOrSosed',
        count: { 4: 0, 5: 1, 6: 1, 7: 1, 8: 1, 9: 2, 10: 2, 11: 2, 12: 2 }
    },
    zakolchennayDver: {
        type: "card", isAttacking: false, isDefending: true, target: 'selfOrSosed',
        count: { 4: 1, 5: 1, 6: 1, 7: 2, 8: 2, 9: 2, 10: 2, 11: 3, 12: 3 }
    },
    iViEtoNazivaeteVecherinkoy: {
        type: "panika", allReady: true,
        count: { 4: 0, 5: 1, 6: 1, 7: 1, 8: 1, 9: 2, 10: 2, 11: 2, 12: 2 }
    },
    razDva: {
        type: "panika",
        count: { 4: 0, 5: 1, 6: 1, 7: 1, 8: 1, 9: 2, 10: 2, 11: 2, 12: 2 }
    },
    ubiraysyaProch: {
        type: "panika",
        count: { 4: 0, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1, 10: 1, 11: 1, 12: 1 }
    },
    starieVerevki: {
        type: "panika",
        count: { 4: 0, 5: 0, 6: 1, 7: 1, 8: 1, 9: 2, 10: 2, 11: 2, 12: 2 }
    },
    tolkoMejduNami: {
        type: "panika",
        count: { 4: 0, 5: 0, 6: 0, 7: 1, 8: 1, 9: 2, 10: 2, 11: 2, 12: 2 }
    },
    davaiDrujit: {
        type: "panika",
        count: { 4: 0, 5: 0, 6: 0, 7: 1, 8: 1, 9: 2, 10: 2, 11: 2, 12: 2 }
    },
    vremyaPriznaniy: {
        type: "panika",
        count: { 4: 0, 5: 0, 6: 0, 7: 0, 8: 1, 9: 1, 10: 1, 11: 1, 12: 1 }
    },
    tsepnayaReaksia: {
        type: "panika", endTurn: true, allReady: true,
        count: { 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 2, 10: 2, 11: 2, 12: 2 }
    },
    triChetyre: {
        type: "panika",
        count: { 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 2, 10: 2, 11: 2, 12: 2 }
    },
    uups: {
        type: "panika",
        count: { 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 1, 12: 1 }
    },
    svidanieVSlepuyu: {
        type: "panika", endTurn: true,
        count: { 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1, 10: 2, 11: 2, 12: 2 }
    },
    zabivchivost: {
        type: "panika",
        count: { 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1, 10: 1, 11: 1, 12: 1 }
    },
    zarajenie: {
        type: "card",
        count: { 4: 8, 5: 9, 6: 12, 7: 13, 8: 15, 9: 16, 10: 19, 11: 19, 12: 19 }
    },
    nechto: {
        type: "card", giveAble: false,
        count: { 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1, 10: 1, 11: 1, 12: 1 }
    }
};

for (let card in cardsDeck) {
    cardsDeck[card].id = card
};

// const getActionCard = (action) => {
//         if (action !== null) {
//         return {
//             action: {
//                 id: action,
//                 type: cardsDeck[action].type
//             }
//         }
//     }
// }
const createDeck = (players, startWithNechto) => {
    let deck = [], playersCardWillbe = players * 4 - 1, res = [];
    for (let card in cardsDeck) {
        const cardCount = cardsDeck[card].count[players];
        deck.push({
            card: card,
            cardFull: cardsDeck[card],
            count: cardCount,
            type: cardsDeck[card].type
        });
    };
    let realdeck = [];
    let zCount = shuffleArray(new Array(19).fill().map((it, ind) => ind))
    deck.forEach(el => {
        for (let i = 0; i < el.count; i++) {
            let cardFull = el.cardFull
            if (cardFull.id === 'zarajenie') {
                cardFull = { ...cardFull }
                cardFull.zNumber = zCount.pop()
            }
            realdeck.push(cardFull)
        }
    });
    let newDeck = realdeck.filter(card => card.id !== "zarajenie" && card.type == "card" && card.id !== "nechto");
    let panikDeck = realdeck.filter(card => card.type == "panika" && card.id !== 'tsepnayaReaksia');
    //let panikDeck = realdeck.filter(card => card.type == "p")
    let zarajenieDeck = realdeck.filter(card => card.id == "zarajenie");
    let nechtoDeck = realdeck.filter(card => card.id == "nechto");
    let shuffledDeck = shuffleArray([...newDeck]);
    if (startWithNechto) {
        let shuffleArrayNechto = [...shuffledDeck].splice(0, playersCardWillbe);
        shuffleArrayNechto.push(...nechtoDeck)
        shuffleArray(shuffleArrayNechto);
        let shuffleOstatok = shuffleArray(shuffledDeck.splice(playersCardWillbe + 1, shuffledDeck.length - 1));
        let ostatokDeck = shuffleArray([...shuffleOstatok, ...zarajenieDeck, ...panikDeck]);
        ostatokDeck.unshift({ ...cardsDeck.uporstvo, id: 'uporstvo' })
        res = [...shuffleArrayNechto, ...ostatokDeck]
    } else {
        let firstdeckgo = [...shuffledDeck].splice(0, playersCardWillbe + 1);
        let shufledFirsDeck = shuffleArray(firstdeckgo)
        let ostatokDeck = shuffledDeck.splice(playersCardWillbe + 2, shuffledDeck.length - 1);
        ostatokDeck.push(...nechtoDeck);
        let shuffleDeki = shuffleArray([...ostatokDeck, ...panikDeck, ...zarajenieDeck])
        shuffleDeki.unshift({ ...cardsDeck.smaivayUdochki, id: 'smaivayUdochki' })
        shuffleDeki.unshift({ ...cardsDeck.smaivayUdochki, id: 'smaivayUdochki' })
        res = [...shufledFirsDeck, ...shuffleDeki]
    };
    return res
};

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

// const deck = Array();
// let deck9 = Array();
// for (let key in districts) {
//     for (let i = 0; i < districts[key].quantity; i++)
//         if ((districts[key].type !== 9 && !onlyFilter) || districtsFilter.includes(key))
//             (districts[key].type === 9 ? deck9 : deck).push({
//                 type: key,
//                 cost: districts[key].cost,
//                 kind: districts[key].type
//             });
// }
// //Пока что театр не будет работать для 2 и 3 игроков
// if (players < 4) deck9 = deck9.filter(card => card.type !== "theater");
// shuffle(deck9).splice(14);
// return shuffle([...deck, ...deck9]);

const getUniqueDistricts = () => {
    return Object.keys(districts).filter((district) => districts[district].type === 9);
};

module.exports = {
    cardsDeck,
    createDeck,
    getUniqueDistricts,
    //getActionCard
};
