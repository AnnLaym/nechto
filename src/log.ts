import { Ref } from "vue";
import { CardId, UserLang, userLang } from "./service";

export function getCardName(cardId: CardId) {
    return cardsData[cardId]?.title[userLang.value] ?? cardId
}
export function getCardDescription(cardId: CardId) {
    return cardsData[cardId]?.desciption[userLang.value] ?? ""
}
export function getKnopkaName(knopkaId: keyof typeof knopki) {
    return knopki[knopkaId]?.title[userLang.value]
}
export function getCardLog(cardId: CardId) {
    return cardsData[cardId]?.log[userLang.value] ?? cardId
}
export function getActionLog(action: keyof typeof actionsData) {
    return actionsData[action]?.log[userLang.value] ?? action
}
export function getPodskazkaName(podskazka: keyof typeof podskazkaData) {
    return podskazkaData[podskazka]?.log[userLang.value] ?? podskazka
}

type PartialRecord<K extends keyof any, T> = {
    [P in K]?: T;
};
interface CardMetaData {
    log: PartialRecord<string, string>;
    title: PartialRecord<string, string>;
    desciption: PartialRecord<string, string>;
}
interface ActionMetaData {
    log: PartialRecord<string, string>;
}
interface KnopkaMetaData {
    title: PartialRecord<any, any>;
}
const cardsData: PartialRecord<CardId, CardMetaData> = {
    ognemet: {
        log: {
            ru: "сжигает",
            ua: "спалює",
            en: "flames",
        },
        title: {
            ru: "Огнемёт",
            ua: "Вогнемет",
            en: "Flamethrower",
        },
        desciption: {
            ru: "Соседний игрок выбывает из игры",
            ua: "Сусідній гравець вибуває з гри",
            en: "Neighboring player is out of the game",
        }
    },
    analiz: {
        log: {
            ru: "проверяет",
            ua: "перевіряє",
            en: "checks",
        },
        title: {
            ru: "Анализ",
            ua: "Аналіз",
            en: "Analysis",
        },
        desciption: {
            ru: "Посмотрите карты на руке сосденего игрока",
            ua: "Подивіться карти в руці сусіднього гравця",
            en: "Look at the cards in the next player's hand",
        }
    },
    topor: {
        log: {
            ru: "испольует топор",
            ua: "використовує сокиру",
            en: "uses axe",
        },
        title: {
            ru: "Топор",
            ua: "Сокира",
            en: "Axe",
        },
        desciption: {
            ru: "Сбросьте сыграную на вас или на соседнего игрока карту 'Карантин', или выложенную между вами карту 'Заколоченная дверь'",
            ua: "Скиньте зіграну на вас або на сусіднього гравця карту 'Карантин' або викладену між вами карту 'Забиті двері'",
            en: "Discard a 'Quarantine' card played on you or an adjacent player, or a 'Boarded Door' card placed between you",
        }
    },
    podozrenie: {
        log: {
            ru: "смотрит карту",
            ua: "дивиться карту",
            en: "checks cards",
        },
        title: {
            ru: "Подозрение",
            ua: "Підозра",
            en: "Suspicion",
        },
        desciption: {
            ru: "Посмотрите одну случайную карту на руке соседнего игрока",
            ua: "Подивіться одну випадкову картку в руці сусіднього гравця",
            en: "Look at one random card in an adjacent player's hand",
        }
    },
    viski: {
        log: {
            ru: "показывает руку",
            ua: "показує руку",
            en: "shows his hand",
        },
        title: {
            ru: "Виски",
            ua: "Віскі",
            en: "Whiskey",
        },
        desciption: {
            ru: "Покажите все свои карты остальным игрокам. Эту карту можно играть только на себя",
            ua: "Покажіть усі свої карти іншим гравцям. Цю карту можна грати лише на себе",
            en: "Show all your cards to other players. This card can only be played on yourself.",
        }
    },
    uporstvo: {
        log: {
            ru: "ищет карты",
            ua: "шукає карти",
            en: "looks for cards",
        },
        title: {
            ru: "Упорство",
            ua: "Завзятість",
            en: "Resolute",
        },
        desciption: {
            ru: "Возьмите 3 карты событий, оставьте на руке 1 и сбросьте остальные. Затем сыграйте или сбросьте карту",
            ua: "Візьміть 3 карти подій, залиште в руці 1 і скиньте решту. Потім зіграйте або скиньте картку",
            en: "Draw 3 event cards, keep 1 in hand and discard the 2 remaining. Then play or discard a card",
        }
    },
    glyadiPoStoronam: {
        log: {
            ru: "меняет направление игры",
            ua: "змінює напрям гри",
            en: "changes game`s direction",
        },
        title: {
            ru: "Гляди по сторонам!",
            ua: "Дивись на всі боки!",
            en: "Watch your back",
        },
        desciption: {
            ru: "Очередность хода передается в обратную сторону. Меняется порядок хода игроков и направление обмена картой с соседом",
            ua: "Черговість ходу передається у зворотній бік. Змінюється порядок ходу гравців та напрямок обміну картою з сусідом",
            en: "The turn order is reversed. The order of the players' turn and the direction of the exchange of a card with a neighbor are changed",
        }
    },
    menyaemsyaMestami: {
        log: {
            ru: "меняется местами с",
            ua: "міняється місцями з",
            en: "changes places with",
        },
        title: {
            ru: "Меняемся местами!",
            ua: "Міняємось місцями",
            en: "Change places!",
        },
        desciption: {
            ru: "Поменяйтесь местами с соседним игроком, если он не на карантине и не за заколоченной дверью",
            ua: "Поміняйтеся місцями з сусіднім гравцем, якщо він не на карантині та не за забитими дверима",
            en: "Swap places with a nearby player if they are not in quarantine or behind a boarded up door",
        }
    },
    smaivayUdochki: {
        log: {
            ru: "меняется местами с",
            ua: "міняється місцями з",
            en: "swaps with",
        },
        title: {
            ru: "Сматывай удочки!",
            ua: "Краще біжи!",
            en: "You'd better run!",
        },
        desciption: {
            ru: "Поменяйтесь местами с любым игроком по вашему выбору, если он не на карантине. Все заколоченные двери игнорируйте.",
            ua: "Поміняйтеся місцями з будь-яким гравцем на ваш вибір, якщо він не на карантині. Усі забиті двері ігноруйте.",
            en: "Swap places with any player of your choice, as long as they are not in quarantine. Ignore all boarded up doors.",
        }
    },
    soblazn: {
        log: {
            ru: "обменивается картой с",
            ua: "обмінюється картою з",
            en: "exchange card with",
        },
        title: {
            ru: "Соблазн",
            ua: "Спокуса",
            en: "Seduction",
        },
        desciption: {
            ru: "Поменяйтесь одной картой с любым игроком по вашему выбору, если он не на карантине. Ваш ход заканчивается.",
            ua: "Поміняйтеся однією картою з будь-яким гравцем на ваш вибір, якщо він не на карантині. Ваш хід закінчується.",
            en: "Trade one card with any player of your choice, unless they are in quarantine. Your turn ends.",
        }
    },
    strah: {
        log: {
            ru: "не обменивается",
            ua: "не обмінюється",
            en: "not exchanged",
        },
        title: {
            ru: "Страх",
            ua: "Жах",
            en: "Scary",
        },
        desciption: {
            ru: "Откажитесь от обмена и осмотрите карту, от которой отказались. Возьмите 1 карту событий.",
            ua: "Відмовтеся від обміну та огляньте карту, від якої відмовилися. Візьміть 1 карту подій.",
            en: "Refuse the exchange and inspect the card that was refused. Draw 1 card.",
        }
    },
    mneIZdesNePloha: {
        log: {
            ru: "не меняется местами",
            ua: "не міняється місцями",
            en: "does not change place",
        },
        title: {
            ru: "Мне и здесь неплохо",
            ua: "Мені і тут непогано",
            en: "I'm comfortable",
        },
        desciption: {
            ru: "Отмените эффект карты 'Меняемся местами!' или 'Сматывай удочки', если стали ее целью. Возьмите 1 карту события",
            ua: "Скасуйте ефект карти 'Міняємось місцями!' або 'Краще біжи!', якщо стали її метою. Візьміть 1 карту події",
            en: "Cancel the 'Change places!' card effect or 'You'd better run!' if that's her target. Draw 1 event card",
        }
    },
    netUjSpasibo: {
        log: {
            ru: "не обменивается",
            ua: "не обмінюється",
            en: "not exchanged",
        },
        title: {
            ru: "Нет уж спасибо!",
            ua: "Вибачте ні!",
            en: "No thanks!",
        },
        desciption: {
            ru: "Откажитесь от обмена картами. Возьмите 1 карту событий.",
            ua: "Відмовтеся від обміну картами. Візьміть 1 карту подій",
            en: "Stop exchanging cards. Draw 1 card",
        }
    },
    mimo: {
        log: {
            ru: "не обменивается",
            ua: "не обмінюється",
            en: "not exchanged",
        },
        title: {
            ru: "Мимо!",
            ua: "Не влучив!",
            en: "Missed!",
        },
        desciption: {
            ru: "Откажитесь от обмена картами. Вместо вас картами меняется следующий за вами игрок. Возьмите 1 карту события.",
            ua: "Відмовтеся від обміну картами. Замість вас картами обмінюється наступний за вами гравець. Візьміть 1 карту події.",
            en: "Stop exchanging cards. Instead of you, the next player behind you changes cards. Draw 1 card.",
        }
    },
    nikakogoShahlika: {
        log: {
            ru: "выживает",
            ua: "виживає",
            en: "survives",
        },
        title: {
            ru: "Никакого шашлыка!",
            ua: "Ніякого шашлику!",
            en: "No barbecue!",
        },
        desciption: {
            ru: "Отмените эффект карты 'Огнемет', если вы стали ее целью. Возьмите 1 карту события. ",
            ua: "Скасуйте ефект карти 'Вогнемет', якщо ви стали її метою. Візьміть 1 карту події",
            en: "Cancel the effect of 'Flamethrower' if you are targeted by it. Draw 1 card",
        }
    },
    karantin: {
        log: {
            ru: "сажает на карантин",
            ua: "садить на карантин",
            en: "puts in quarantine",
        },
        title: {
            ru: "Карантин",
            ua: "Карантин",
            en: "Quarantine",
        },
        desciption: {
            ru: "Сыграйте эту карту на себя или соседнего игрока. Следующие 2 своих хода игрок на карантине не может меняться картами, играть карты событий или становится целью таких карт.",
            ua: "Зіграйте цю карту на себе або сусіднього гравця. Наступні 2 своїх ходи гравець на карантині не може обмінюватися картами, грати карти подій або стає цілью таких карт.",
            en: "Play this card on yourself or an adjacent player. For the next 2 of their turns, the quarantined player cannot swap cards, play event cards, or become the target of such cards.",
        }
    },
    zakolchennayDver: {
        log: {
            ru: "закрывается от",
            ua: "зачиняється від",
            en: "closes from",
        },
        title: {
            ru: "Заколоченная дверь",
            ua: "Забиті двері",
            en: "Barred door",
        },
        desciption: {
            ru: "Положите эту карту между собой и соседним игроком. Между вами не может совершаться никаких действий и обменов",
            ua: "Покладіть цю карту між собою та сусіднім гравцем. Між вами не може відбуватися жодних дій та обмінів",
            en: "Place this card between you and an adjacent player. No actions or exchanges can take place between you",
        }
    },
    iViEtoNazivaeteVecherinkoy: {
        log: {
            ru: "",
            ua: "",
            en: "",
        },
        title: {
            ru: "И это вы называете вечеринкой?",
            ua: "І це ви звете вечіркою?",
            en: "So this is the party?",
        },
        desciption: {
            ru: "Все сыгранные карты 'Карантин' и 'Заколоченная дверь' сбрасываются. Затем начиная с Вас и по часовой стрелке все игроки парами меянются местами.",
            ua: "Усі зіграні карти 'Карантин' і 'Забиті двері' скидаються. Потім, починаючи з Вас і за годинниковою стрілкою, всі гравці парами міняються місцями.",
            en: "All played 'quarantine' and 'barred door' cards are discarded. Then, starting with you and clockwise, all players switch places in pairs.",
        }
    },
    razDva: {
        log: {
            ru: "",
            ua: "",
            en: "",
        },
        title: {
            ru: "Раз, два",
            ua: "Раз, два",
            en: "One, two...",
        },
        desciption: {
            ru: "Поменяйтесь с третьим игроком слева или справа (по вашему выбору). Если игрок на карантине - смена мест не происходит.",
            ua: "Поміняйтеся з третім гравцем ліворуч або праворуч (на ваш вибір). Якщо гравець на карантині – зміна місць не відбувається.",
            en: "Swap with the third player on the left or right (your choice). If a player is in quarantine, there is no change of seats.",
        }
    },
    ubiraysyaProch: {
        log: {
            ru: "",
            ua: "",
            en: "",
        },
        title: {
            ru: "Убирайся прочь",
            ua: "Забирайся геть",
            en: "Get out!",
        },
        desciption: {
            ru: "Поменяйтесь местами с любым игроком (по вашему выбору), если он не на карантине",
            ua: "Поміняйтеся місцями з будь-яким гравцем (на ваш вибір), якщо він не на карантині",
            en: "Swap places with any player (of your choice) if they are not quarantined",
        }
    },
    starieVerevki: {
        log: {
            ru: "",
            ua: "",
            en: "",
        },
        title: {
            ru: "Старые верёвки",
            ua: "Старі мотузки",
            en: "Rotten ropes",
        },
        desciption: {
            ru: "Все сыгранные карты 'Карантин' сбрасываются",
            ua: "Усі зіграні карти 'Карантин' скидаються",
            en: "All played 'Quarantine' cards are discarded",
        }
    },
    tolkoMejduNami: {
        log: {
            ru: "",
            ua: "",
            en: "",
        },
        title: {
            ru: "Только между нами",
            ua: "Тільки між нами",
            en: "Just between us...",
        },
        desciption: {
            ru: "Покажите карты на руке соседнему игроку по вашему выбору",
            ua: "Покажіть карти в руці сусідньому гравцю на ваш вибір",
            en: "Show the cards in your hand to an adjacent player of your choice",
        }
    },
    davaiDrujit: {
        log: {
            ru: "",
            ua: "",
            en: "",
        },
        title: {
            ru: "Давай дружить",
            ua: "Нумо дружити",
            en: "Can`t we be friends?",
        },
        desciption: {
            ru: "Поменяйтесь 1 картой с любым игроком (по вашему выбору), если он не на карантине",
            ua: "Поміняйтеся 1 карткою з будь-яким гравцем (на ваш вибір), якщо він не на карантині",
            en: "Swap 1 card with any player (of your choice) if he is not in quarantine",
        }
    },
    vremyaPriznaniy: {
        log: {
            ru: "",
            ua: "",
            en: "",
        },
        title: {
            ru: "Время признаний",
            ua: "Час відвертостей",
            en: "Revelations",
        },
        desciption: {
            ru: "хуета не работает, рестартите игру",
            ua: "хуїта не працює, рестартіть гру",
            en: "хуета не работает, рестартите игру",
        }
    },
    tsepnayaReaksia: {
        log: {
            ru: "",
            ua: "",
            en: "",
        },
        title: {
            ru: "Цепная реакция",
            ua: "Ланцюгова реакція",
            en: "Round and round",
        },
        desciption: {
            ru: "Каждый игрок одновременно с остальными отдает 1 карту следующему по порядку хода игроку, игнорируя все сыгранные карты 'Карантин' и 'Заколоченная дверь'. Нечто может заразить передав 'Заражение'. От обмена отказаться невозможно. Ваш ход заканчивается.",
            ua: "Кожен гравець одночасно з рештою віддає 1 карту наступному по порядку гравцю, ігноруючи всі зіграні карти 'Карантин' та 'Забиті двері'. Щось може заразити передавши 'Зараження'. Від обміну відмовитись неможливо. Ваш хід закінчується.",
            en: "Each player, at the same time as the others, gives 1 card to the next player in turn order, ignoring all played 'Quarantine' and 'Boarded Door' cards. Something can infect by transmitting 'Infection'. It is impossible to refuse the exchange. Your turn ends.",
        }
    },
    triChetyre: {
        log: {
            ru: "",
            ua: "",
            en: "",
        },
        title: {
            ru: "Три, четыре",
            ua: "Три, чотири",
            en: "Three, four",
        },
        desciption: {
            ru: "Все карты 'Заколоченная дверь' сбрасываются",
            ua: "Всі карти 'Забиті двері' скидаються",
            en: "All 'Barred Door' cards are discarded",
        }
    },
    uups: {
        log: {
            ru: "",
            ua: "",
            en: "",
        },
        title: {
            ru: "Уупс",
            ua: "Уупс",
            en: "Ooops!",
        },
        desciption: {
            ru: "Покажите все карты на руке другим игрокам",
            ua: "Покажіть усі карти в руці іншим гравцям",
            en: "Show all cards in your hand to other players",
        }
    },
    svidanieVSlepuyu: {
        log: {
            ru: "",
            ua: "",
            en: "",
        },
        title: {
            ru: "Свидание в слепую",
            ua: "Побачення на осліп",
            en: "Blind date",
        },
        desciption: {
            ru: "Поменяйте одну карту из руки на карту из общей колоды. Ваш ход заканчивается.",
            ua: "Поміняйте одну карту з руки на карту з загальної колоди. Ваш хід закінчується.",
            en: "Swap one card from your hand to a card from the general deck. Your turn ends.",
        }
    },
    zabivchivost: {
        log: {
            ru: "",
            ua: "",
            en: "",
        },
        title: {
            ru: "Забыв- чивость",
            ua: "Забудьку- ватість",
            en: "Forgetful",
        },
        desciption: {
            ru: "Сбросьте 3 карты из руки и возьмите 3 новые карты",
            ua: "Скиньте 3 карти з руки та візьміть 3 нові карти",
            en: "Discard 3 cards from your hand and draw 3 new cards",
        }
    },
    zarajenie: {
        desciption: {
            ru: "Получив эту карту от другого игрока, вы становитесь зараженным и обязаны держать ее на руке до конца игры",
            ua: "Отримавши цю карту від іншого гравця, ви стаєте зараженим та зобов'язані тримати її в руці до кінця гри",
            en: "When you receive this card from another player, you become infected and must keep it in your hand for the rest of the game.",
        },
        title: {
            ru: "Заражение",
            ua: "Зараження",
            en: "Infected",
        },
        log: {
            ru: "",
            ua: "",
            en: "",
        }
    },
    nechto: {
        desciption: {
            ru: "Теперь Вы Нечто",
            ua: "Тепер Ви Щось",
            en: "Now you are Thing",
        },
        title: {
            ru: "Нечто",
            ua: "Щось",
            en: "Thing",
        },
        log: {
            ru: "",
            ua: "",
            en: "",
        }
    }


};
const actionsData: Record<string, ActionMetaData> = {
    'drop-card': {
        log: {
            ru: "сбрасывает карту",
            ua: "скидує карту",
            en: "discards",
        },
    },
    'grab-card': {
        log: {
            ru: "берет карту",
            ua: "тягне карту",
            en: "grabs card",
        },
    },
    'obmen': {
        log: {
            ru: "обменивается с",
            ua: "обмінюється з",
            en: "exchanges with",
        },
    },
    'start-game': {
        log: {
            ru: "Старт игры",
            ua: "Початок гри",
            en: "Game start",
        },
    },
    'end-game': {
        log: {
            ru: "Конец игры",
            ua: "Кінець гри",
            en: "End game",
        }
    },
    'start-round': {
        log: {
            ru: 'ходит',
            ua: 'ходить',
            en: '`s turn'
        }
    },
    'smertKring': {
        log: {
            ru: 'умирает от кринжа',
            ua: 'вмер від крінжі',
            en: 'умирает от кринжа'
        }
    },
    'bez-nechto': {
        log: {
            ru: 'с Нечто в колоде',
            ua: 'з Щось у колоді',
            en: 'with Thing in deck'
        }
    },
    'reshuffle': {
        log: {
            ru: 'Колода перетасована',
            ua: 'Колода замішана',
            en: 'Deck reshuffled'
        }
    },

}
const knopki = {
    sigrat: {
        title: {
            ru: "сыграть",
            ua: "зіграти",
            en: "play",
        },
    },
    polojitKartuNaObmen: {
        title: {
            ru: "положить карту на обмен",
            ua: "покласти карту на обмін",
            en: "put card in exchange",
        },
    },
    vzyatKartu: {
        title: {
            ru: "взять карту",
            ua: "тягнути карту",
            en: "grab card",
        },
    },
    sigratCartu: {
        title: {
            ru: "сыграть",
            ua: "зіграти",
            en: "play card",
        },
    },
    skinutCartu: {
        title: {
            ru: "скинуть",
            ua: "скинути",
            en: "discard",
        },
    },
    goPanika: {
        title: {
            ru: "сыграть панику",
            ua: "зіграти паніку",
            en: "play panic",
        }
    },
    ok: {
        title: {
            ru: "ок",
            ua: "ок",
            en: "ok",
        },
    },
    sest: {
        title: {
            ru: "сесть",
            ua: "сісти",
            en: "join",
        },
    },
    spektators: {
        title: {
            ru: "зрители",
            ua: "глядачі",
            en: "spectators",
        },
    },
    panika: {
        title: {
            ru: "паника",
            ua: "паніка",
            en: "panic",
        },
    },
    pass: {
        title: {
            ru: "пас",
            ua: "пас",
            en: "pass",
        },
    },
    phashka: {
        title: {
            ru: 'Бета-версия игры Нечто',
            ua: 'Бета-версія гри "Щось" (Нечто)',
            en: '"stay away" (Nechto) Beta',
        }
    },
    plahskaTwo: {
        title: {
            ru: 'discord: sharji',
            ua: 'discord: sharji',
            en: 'discord: sharji',
        }
    },
    win: {
        title: {
            ru: 'Победа Нечто!',
            ua: 'Перемогло Щось!',
            en: 'Thing won!',
        }
    },
    'win-ebanati': {
        title: {
            ru: 'Нечто проиграло!',
            ua: 'Щось програло!',
            en: 'Thing lost!',
        }
    },
    'карты': {
        title: {
            ru: 'Карты',
            ua: 'Карти',
            en: 'Cards',
        }
    },
} satisfies Record<string, KnopkaMetaData>
const podskazkaData: Record<string, ActionMetaData> = {
    'Выбирает карту для обмена': {
        log: {
            ru: "выбирает карту для обмена",
            ua: "вибирає карту для обміну",
            en: "chooses card for exchanging",
        },
    },
    'взять карту': {
        log: {
            ru: "должен взять карту",
            ua: "повинен взяти карту",
            en: "must grab card",
        },
    },
    'свап местом': {
        log: {
            ru: "отказывается или соглашается на смену мест",
            ua: "відхиляє або погоджується на зміну місць",
            en: "declining or accepting place swap",
        },
    },
    'свап картой': {
        log: {
            ru: "отказывается или соглашается на обмен картой",
            ua: "відхиляє або походжуєтсья на обмін картою",
            en: "declining or accepting card exchange",
        },
    },
    'играть': {
        log: {
            ru: "должен сыграть или сбросить карту",
            ua: "повинен зіграти або скинути карту",
            en: "must play or drop card",
        },
    },
    'упорство': {
        log: {
            ru: "выбирает карту",
            ua: "вибирає карту",
            en: "chooses card",
        },
    },
    'просмотр карты': {
        log: {
            ru: "смотрит карты",
            ua: "дивиться карти",
            en: "checks cards",
        },
    },
    'панику': {
        log: {
            ru: "должен сыграть панику",
            ua: "повинен зіграти паніку",
            en: "must play panic card",
        },
    },
    'с': {
        log: {
            ru: "с",
            ua: "з",
            en: "with",
        },
    },
    'смотрит карту': {
        log: {
            ru: "смотрит карту",
            ua: "дивиться карту",
            en: "checks card",
        },
    },
    'сгореть': {
        log: {
            ru: "отказывается или соглашается на смерть",
            ua: "відмовляється чи погоджується на смерть",
            en: "refuses or agrees to die",
        },
    }
}