import { CardId } from "./service";
const lang = "ru"

export function getCardName(cardId: CardId) {
    return cardsData[cardId]?.title[lang] ?? cardId
}
export function getCardDescription(cardId: CardId) {
    return cardsData[cardId]?.desciption[lang] ?? ""
}
export function getKnopkaName(KnopkaId: keyof typeof knopki) {
    return knopki[KnopkaId]?.title[lang] ?? KnopkaId
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
    title: PartialRecord<string, string>;
}
const cardsData: PartialRecord<CardId, CardMetaData> = {
    ognemet: {
        log: {
            ru: "сжигает",
            ua: "сжигає",
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
            ua: "",
            en: "",
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
            en: "",
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
            ru: "",
            ua: "",
            en: "",
        },
        title: {
            ru: "Сматый удочки!",
            ua: "Краще біжи!",
            en: "You'd better run!",
        },
        desciption: {
            ru: "",
            ua: "",
            en: "",
        }
    },
    soblazn: {
        log: {
            ru: "",
            ua: "",
            en: "",
        },
        title: {
            ru: "Соблазн",
            ua: "Спокуса",
            en: "Seduction",
        },
        desciption: {
            ru: "",
            ua: "",
            en: "",
        }
    },
    strah: {
        log: {
            ru: "",
            ua: "",
            en: "",
        },
        title: {
            ru: "Страх",
            ua: "Жах",
            en: "Scary",
        },
        desciption: {
            ru: "",
            ua: "",
            en: "",
        }
    },
    mneIZdesNePloha: {
        log: {
            ru: "",
            ua: "",
            en: "",
        },
        title: {
            ru: "Мне и здесь не плохо",
            ua: "Мені і тут непогано",
            en: "I'm comfortable",
        },
        desciption: {
            ru: "",
            ua: "",
            en: "",
        }
    },
    netUjSpasibo: {
        log: {
            ru: "",
            ua: "",
            en: "",
        },
        title: {
            ru: "Нет уж спасибо!",
            ua: "Вибачте ні!",
            en: "No thanks!",
        },
        desciption: {
            ru: "",
            ua: "",
            en: "",
        }
    },
    mimo: {
        log: {
            ru: "",
            ua: "",
            en: "",
        },
        title: {
            ru: "Мимо!",
            ua: "Не влучив!",
            en: "Missed!",
        },
        desciption: {
            ru: "",
            ua: "",
            en: "",
        }
    },
    nikakogoShahlika: {
        log: {
            ru: "",
            ua: "",
            en: "",
        },
        title: {
            ru: "Никакого шашлыка!",
            ua: "Ніякого шашлику!",
            en: "No barbecue!",
        },
        desciption: {
            ru: "",
            ua: "",
            en: "",
        }
    },
    karantin: {
        log: {
            ru: "",
            ua: "",
            en: "",
        },
        title: {
            ru: "Карантин",
            ua: "Карантин",
            en: "Quarantine",
        },
        desciption: {
            ru: "",
            ua: "",
            en: "",
        }
    },
    zakolchennayDver: {
        log: {
            ru: "",
            ua: "",
            en: "",
        },
        title: {
            ru: "Заколоченная дверь",
            ua: "Забиті двері",
            en: "Barred door",
        },
        desciption: {
            ru: "",
            ua: "",
            en: "",
        }
    },


};
const actionsData: Record<string, ActionMetaData> = {
    'drop-card': {
        log: {
            ru: "",
            ua: "",
            en: "",
        },
    },
    'grab-card': {
        log: {
            ru: "",
            ua: "",
            en: "",
        },
    },
    'obmen': {
        log: {
            ru: "",
            ua: "",
            en: "",
        },
    },
    'start-game': {
        log: {
            ru: "",
            ua: "",
            en: "",
        },
    },
    'end-game': {
        log: {
            ru: "",
            ua: "",
            en: "",
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
            ru: "взять карту",
            ua: "тягнути карту",
            en: "grab card",
        },
    },
    skinutCartu:{
        title: {
            ru: "скинуть карту",
            ua: "скинути карту",
            en: "discard",
        },
    },
    ok:{
        title: {
            ru: "ок",
            ua: "ок",
            en: "ok",
        },
    }

} satisfies Record<string, KnopkaMetaData>
