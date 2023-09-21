import { Ref, ref, watch } from 'vue';
import { processWrappedRequest, ReactAppWindow, requestWrap, SocketWrappedRequestResult } from './react-common';


const GAME_CHANNEL = '/bg/nechto';

export type User = string;
export type Slot = number;
export type CardId = string;


export interface Card {
    type: "card" | "panika";
    count: Record<number, number>;
    isAttacking?: boolean;
    isDefending?: boolean;
    action?: boolean;
    endTurn?: boolean;
    allReady?: boolean;
    id: string;
    target?: "sosed" | "any" | "selfOrSosed";
}

interface NechtoState {
    inited: boolean;
    hostId: string;
    playerSlots: (User | null)[];
    playerNames: Record<User, string>;
    onlinePlayers: User[];
    spectators: User[];
    teamsLocked: boolean;
    phase: 0 | 1 | 2 | 3;
    currentPlayer: Slot | null;
    targetSlot: Slot | null;
    invertDirection: boolean;
    startWithNechto: boolean;
    currentPanika: Card | null;
    action: CardId | null | string;
    karantin: Record<Slot, number>;
    time: number;
    timed: boolean;
    readyPlayers: Record<Slot, boolean>;
    target: Slot | null;
    dveri: Slot[];
    showAllHand?: Card[];
    allReadyNedeed: boolean;
    gameLog: { action?: string; card?: Card; actors?: User[]; panika?: boolean }[]; result?: string;
    smallTimer: number;
    bigTimer: number;
    isObmenReady: boolean;
    voting: boolean;
    zarajennie?: Slot[];
    cards?: Card[];
    nechto?: Slot | null;
    chekCards?: Card[];
    discardSize: number;
    deckSize: number;
    userId: User;
    userSlot: Slot | null;
    umerSlots: Slot[] | null;
    currentCardPanik: Card | null;
    fullTimer: number;
}

declare const window: ReactAppWindow<NechtoState>;

export function useNechtoService() {
    if (!nechtoService)
        nechtoService = createNechtoService()
    return nechtoService
}
export type UserLang = 'ua' | 'ru' | 'en';
export const userLang: Ref<UserLang> = ref('ua')

export function toggleLanguage1() {
  switch (userLang.value) {
    case 'ua':
      userLang.value = 'ru';
      break;
    case 'ru':
      userLang.value = 'en';
      break;
    case 'en':
      userLang.value = 'ua';
      break;
    default:
      break;
  }
}


export function createNechtoService() {
    const socket = window.socket.of(GAME_CHANNEL);
    return {
        toggleLock: () => socket.emit('toggle-lock'),
        dropCard: (index: number) => socket.emit("drop-card", index),
        playCard: (index: number, target?: null | Slot) => socket.emit("play-card", index, target),
        grabCard: () => socket.emit("grab-card"),
        resolveAction: (index: number | null) => socket.emit("resolve-action", index),
        resolveObmen: (index: number) => socket.emit("resolve-obmen", index),
        resolvePassActin: () => socket.emit("resolve-pass-action"),
        panicAction: (index: number | null, target: Slot | null, index1?: number | null, index2?: number | null, index3?: number | null) =>
            socket.emit("panic-action", target, index, index1, index2, index3),
        startGame: () => socket.emit("start-game"),
        abortGame: () => socket.emit("abort-game"),
        playersJoin: (target: Slot) => socket.emit("players-join", target),
        spectatorsJoin: () => socket.emit("spectators-join"),
        removePLayer: (target: User | null) => socket.emit("remove-player", target),
        giveHost: (target: User) => socket.emit("give-host", target),
        setRoomMode: () => socket.emit('set-room-mode', false),
        vilojitCartuNaObmen: (index: number | null) => socket.emit('vilojit-kartu-na-obmen', index),
        startWithNechto: () => socket.emit('start-with-nechto'),
        selectedCard: ref<number | null>(null),
        selectedTarget: ref<Slot | null>(null),
        selectedZabivchivost1: ref<Slot | null>(null),
        selectedZabivchivost2: ref<Slot | null>(null),
        selectedZabivchivost3: ref<Slot | null>(null),
        changeName: (name: string) => socket.emit('change-name', name),
        soblaznResolve: (index: number) => socket.emit("resolve-soblazn", index)
    };
}

let nechtoState = ref(window.gameState || { inited: false });
let stateMaintained = false;
let nechtoService: ReturnType<typeof createNechtoService> | undefined



function maintainState() {
    if (!stateMaintained) {
        stateMaintained = true;
        window.socket.of(GAME_CHANNEL).on('state', (state: NechtoState) => {
            nechtoState.value = {
                ...nechtoState.value,
                ...state,
                userId: window.gameApp.userId,
                userSlot: getUserSLot(state)
            };
        });
        window.socket.of(GAME_CHANNEL).on('player-state', (state: NechtoState) => {
            nechtoState.value = {
                ...nechtoState.value,
                ...state,
                userId: window.gameApp.userId,
            };
        });
        watch(nechtoState, (state, prevState) => {
            if (nechtoService?.selectedCard.value !== null) {
                if (prevState.target === prevState.userSlot && state.target !== state.userSlot) {
                    nechtoService?.selectedCard.value == null
                }
                if (prevState.currentPlayer === prevState.userSlot && state.currentPlayer !== state.userSlot) {
                    nechtoService?.selectedCard.value == null
                }
            }
            if (nechtoService?.selectedTarget.value !== null) {
                if (prevState.target === prevState.userSlot && state.target !== state.userSlot) {
                    nechtoService?.selectedTarget.value == null
                }
                if (prevState.currentPlayer === prevState.userSlot && state.currentPlayer !== state.userSlot) {
                    nechtoService?.selectedTarget.value == null
                }
            }
        })
    }
}



function getUserSLot(state: NechtoState) {
    const slot = state.playerSlots.indexOf(window.gameApp.userId)
    return slot === -1 ? null : slot
}

export function useNechtoState() {
    maintainState();
    return nechtoState;
}

