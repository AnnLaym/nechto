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
            ua: "Подивіться карти в руках сусіднього гравця",
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
            ru: "Сбросьте сыграную на вас или на соседнего игрока карту 'Карантин' или выложенную между вами карту 'Заколоченная дверь'",
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
            ua: "Подивіться одну випадкову картку на руці сусіднього гравця",
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
            ru: "Возьмите 3 карты событий, оставьте на руке 1 и сбросьте остальные 2. Затем сыграйте или сбросьте карту",
            ua: "Візьміть 3 карти подій, залиште на руці 1 і скиньте решту 2. Потім зіграйте або скиньте картку",
            en: "Draw 3 event cards, keep 1 in hand and discard the remaining 2. Then play or discard a card",
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
            ua: "Черговість ходу передається у зворотний бік. Змінюється порядок ходу гравців та напрямок обміну карткою із сусідом",
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
            ua: "Поміняйтеся місцями з сусіднім гравцем, якщо він не на карантині і не за забитими дверима",
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
            ru: "Сматый удочки!",
            ua: "Краще біжи!",
            en: "You'd better run!",
        },
        desciption: {
            ru: "Поменяйтесь местами с любым игроком  по вашему выбору, если он не на карантине. Все заколоченные двери игнорируйте.",
            ua: "Поміняйтеся з місцями з будь-яким гравцем на ваш вибір, якщо він не на карантині. Усі забиті двері ігноруйте.",
            en: "Swap places with any player of your choice, as long as they are not in quarantine. Ignore all boarded up doors.",
        }
    },
    soblazn: {
        log: {
            ru: "обменивается картой с",
            ua: "обмінюється карткою з",
            en: "exchange card with",
        },
        title: {
            ru: "Соблазн",
            ua: "Спокуса",
            en: "Seduction",
        },
        desciption: {
            ru: "Поменяйтесь одной картой с любым игроком по вашему выбору, если он не на карантине. Ваш ход заканчивается. ",
            ua: "Поміняйтеся однією карткою з будь-яким гравцем на ваш вибір, якщо він не на карантині. Ваш хід закінчується.",
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
            ua: "Відмовтеся від обміну та огляньте карту, від якої відмовилися. Візьміть 1 картку подій.",
            en: "Refuse the exchange and inspect the card that was refused. Draw 1 card.",
        }
    },
    mneIZdesNePloha: {
        log: {
            ru: "не меняет место",
            ua: "не змінює місце",
            en: "does not change place",
        },
        title: {
            ru: "Мне и здесь не плохо",
            ua: "Мені і тут непогано",
            en: "I'm comfortable",
        },
        desciption: {
            ru: "Отмените эффект карты 'меняемся местами!' или 'Сматывай удочки', если стали ее целью. Возьмите 1 карту события",
            ua: "Скасуйте ефект карти 'Міняємось місцями!' або 'Краще біжи!', якщо стали її метою. Візьміть 1 картку події",
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
            ru: "Откажитесь от обмена картами. Вместо вас картами меняется следующий за ваи игрок. Возьмите 1 карту события.",
            ua: "Відмовтеся від обміну картами. Замість вас картами змінюється наступний за ваш гравець. Візьміть 1 картку події.",
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
            ua: "Скасуйте ефект карти 'Вогнемет', якщо ви стали її метою. Візьміть 1 картку події",
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
            ua: "Зіграйте цю карту на себе або сусіднього гравця. Наступні 2 своїх ходи гравець на карантині не може змінюватися картами, грати карти подій або стає метою таких карт.",
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
            en: "",
        },
        desciption: {
            ru: "Все сыгранные карты 'карантин' и 'заколоченная дверь' сбрасываются. Затем начиная с Вас и по часовой стрелке все игроки парами меянются местами.",
            ua: "",
            en: "",
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
            en: "",
        },
        desciption: {
            ru: "Поменяйтесь с третьим игроком слева или справа (по вашему выбору). Если игрок на карантине - смены мест не происходит.",
            ua: "",
            en: "",
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
            ua: "Геть звідси",
            en: "",
        },
        desciption: {
            ru: "Поменяйтесь местами с любым игроком (по вашему выбору), если он не на карантине",
            ua: "",
            en: "",
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
            en: "",
        },
        desciption: {
            ru: "Все сыгранные карты 'Карантин' сбрасываются",
            ua: "",
            en: "",
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
            en: "",
        },
        desciption: {
            ru: "Покажите карты на руке соседнему игроку по вашему выбору",
            ua: "",
            en: "",
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
            ua: "Давай дружити",
            en: "",
        },
        desciption: {
            ru: "Поменяйтесь 1 картой с любым игроком (по вашему выбору), если он не на карантине",
            ua: "",
            en: "",
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
            en: "",
        },
        desciption: {
            ru: "хуета не работает, рестартите игру",
            ua: "",
            en: "",
        }
    },
    tsepnayaReaksia: {
        log: {
            ru: "",
            ua: "",
            en: "",
        },
        title: {
            ru: "Цеепная реакция",
            ua: "Ціпна реакція",
            en: "",
        },
        desciption: {
            ru: "Каждый игрок одновременно с остальными отдает 1 карту следующему по порядку хода игроку, игнорируя все сыгранные карты 'Карантин' и 'Заколоченная дверь'. Нечто может заразить передав 'Заражение'. от обмена отказаться невозможно. Ваш ход заканчивается.",
            ua: "",
            en: "",
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
            en: "",
        },
        desciption: {
            ru: "Все карты 'Заколоченная дверь' сбрасываются",
            ua: "",
            en: "",
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
            en: "",
        },
        desciption: {
            ru: "Покажите все карты на руке другим игрокам",
            ua: "",
            en: "",
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
            ua: "Побачення в сліпу",
            en: "",
        },
        desciption: {
            ru: "Поменяйте одну карту с руки на на карту общей колоды. Ваш ход заканчивается.",
            ua: "",
            en: "",
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
            en: "",
        },
        desciption: {
            ru: "Сбросьте 3 карты с руки и возьмите 3 новые карты",
            ua: "",
            en: "",
        }
    },
    zarajenie: {
        log: {
            ru: "",
            ua: "",
            en: "",
        },
        title: {
            ru: "Заражение",
            ua: "Зараження",
            en: "",
        },
        desciption: {
            ru: "",
            ua: "",
            en: "",
        }
    },
    nechto: {
        log: {
            ru: "",
            ua: "",
            en: "",
        },
        title: {
            ru: "Нечто",
            ua: "Щось",
            en: "Something",
        },
        desciption: {
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
    }
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
            ua: "грати паніку",
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
            ru: "пасс",
            ua: "пасувати",
            en: "pass",
        },
    }

} satisfies Record<string, KnopkaMetaData>
