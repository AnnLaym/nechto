import { Ref, ref, watch } from 'vue'
import {
	processWrappedRequest,
	ReactAppWindow,
	requestWrap,
	SocketWrappedRequestResult,
} from './react-common'
import { proccessSound } from './sound'

const GAME_CHANNEL = '/bg/nechto'

export type User = string
export type Slot = number
export type CardId = string

export interface Card {
	type: 'card' | 'panika'
	count?: Record<number, number>
	isAttacking?: boolean
	isDefending?: boolean
	action?: boolean
	endTurn?: boolean
	allReady?: boolean
	id: string
	zNumber?:
		| 0
		| 1
		| 2
		| 3
		| 4
		| 5
		| 6
		| 7
		| 8
		| 9
		| 10
		| 11
		| 12
		| 13
		| 14
		| 15
		| 16
		| 17
		| 18
	target?: 'sosed' | 'any' | 'selfOrSosed'
}

export interface NechtoState {
	inited: boolean
	hostId: string
	playerSlots: (User | null)[]
	playerNames: Record<User, string>
	onlinePlayers: User[]
	spectators: User[]
	teamsLocked: boolean
	phase: 0 | 1 | 2 | 3
	currentPlayer: Slot | null
	targetSlot: Slot | null
	invertDirection: boolean
	startWithNechto: boolean
	currentPanika: Card | null
	action: CardId | null | string
	karantin: Record<Slot, number>
	time: number
	timed: boolean
	readyPlayers: Record<Slot, boolean>
	target: Slot | null
	dveri: Slot[]
	showAllHand?: Card[]
	allReadyNedeed: boolean
	gameLog: {
		smertDolbaeba?: string
		action?: string
		card?: Card
		actors?: User[]
		panika?: boolean
		smetKrinj?: string
		nechto?: boolean
	}[]
	result?: string
	smallTimer: number
	bigTimer: number
	isObmenReady: boolean
	voting: boolean
	zarajennie?: Slot[]
	cards?: Card[]
	nechto?: Slot | null
	chekCards?: Card[]
	discardSize: number
	deckSize: number
	userId: User
	userSlot: Slot | null
	umerSlots: Slot[] | null
	currentCardPanik: Card | null
	fullTimer: number
	waitMoveSlot: Slot | null
	startSlotColor: Record<User, Slot>
	playerAvatars: Record<User, string>
	winner: string | null
	normSosed: Slot[]
	normPlayer: Slot[]
	normThirdPlayers: Slot[]
	dveriClient: Record<Slot, { prev: boolean; next: boolean }>
	isNextCardPanika: boolean | null
	actionCard: Card | null
	bot: boolean | null
}

declare const window: ReactAppWindow<NechtoState>
export const reactCommonRoom = () => window.commonRoom
export function useNechtoService() {
	if (!nechtoService) nechtoService = createNechtoService()
	return nechtoService
}
export type UserLang = 'ua' | 'ru' | 'en'
export const userLang: Ref<UserLang> = ref(localStorage.userLang || 'ua')
export const hyphenate = ((window as any).createHyphenator as any)(
	(window as any).hyphenationPatternsRu as any,
) as (text: string) => string
export const hyphenateEn = ((window as any).createHyphenator as any)(
	(window as any).hyphenationPatternsEnUs as any,
) as (text: string) => string
export function toggleLanguage1() {
	switch (userLang.value) {
		case 'ua':
			userLang.value = 'ru'
			break
		case 'ru':
			userLang.value = 'en'
			break
		case 'en':
			userLang.value = 'ua'
			break
		default:
			break
	}
	localStorage.userLang = userLang.value
}

export function createNechtoService() {
	const socket = window.socket.of(GAME_CHANNEL)
	return {
		toggleLock: () => socket.emit('toggle-lock'),
		dropCard: (index: number) => socket.emit('drop-card', index),
		playCard: (index: number, target?: null | Slot) =>
			socket.emit('play-card', index, target),
		grabCard: () => socket.emit('grab-card'),
		resolveAction: (index: number | null) => socket.emit('resolve-action', index),
		resolveObmen: (index: number) => socket.emit('resolve-obmen', index),
		resolvePassActin: () => socket.emit('resolve-pass-action'),
		panicAction: (
			index: number | null,
			target?: Slot | null,
			index1?: number | null,
			index2?: number | null,
			index3?: number | null,
		) => socket.emit('panic-action', target, index, index1, index2, index3),
		startGame: () => socket.emit('start-game'),
		abortGame: () => socket.emit('abort-game'),
		playersJoin: (target: Slot) => socket.emit('players-join', target),
		spectatorsJoin: () => socket.emit('spectators-join'),
		removePLayer: (target: User | null) => socket.emit('remove-player', target),
		giveHost: (target: User) => socket.emit('give-host', target),
		setRoomMode: () => socket.emit('set-room-mode', false),
		vilojitCartuNaObmen: (index: number | null) =>
			socket.emit('vilojit-kartu-na-obmen', index),
		startWithNechto: () => socket.emit('start-with-nechto'),
		selectedCard: ref<number | null>(null),
		selectedTarget: ref<Slot | null>(null),
		selectedZabivchivost1: ref<Slot | null>(null),
		selectedZabivchivost2: ref<Slot | null>(null),
		selectedZabivchivost3: ref<Slot | null>(null),
		changeName: (name: string) => socket.emit('change-name', name),
		soblaznResolve: (index: number) => socket.emit('resolve-soblazn', index),
	}
}
const zoomed = ref(false)
let cardTimer: number

window.addEventListener('mouseup', () => {
	zoomed.value = false
	window.clearTimeout(cardTimer)
})

export function mouseDaun() {
	cardTimer = window.setTimeout(() => {
		zoomed.value = true
	}, 250)
}

let nechtoState = ref(window.gameState || { inited: false })
let stateMaintained = false
let nechtoService: ReturnType<typeof createNechtoService> | undefined
export let offZvuk = ref(false)

export function offnutZvuk() {
	offZvuk.value = !offZvuk.value
}

function maintainState() {
	if (!stateMaintained) {
		stateMaintained = true
		window.socket.of(GAME_CHANNEL).on('state', (state: NechtoState) => {
			nechtoState.value = {
				...nechtoState.value,
				...state,
				userId: window.gameApp.userId,
				userSlot: getUserSLot(state),
			}
		})
		window.socket.of(GAME_CHANNEL).on('player-state', (state: NechtoState) => {
			nechtoState.value = {
				...nechtoState.value,
				...state,
				userId: window.gameApp.userId,
			}
		})
		watch(nechtoState, (state, prevState) => {
			if (!nechtoService) return
			if (nechtoService?.selectedCard.value !== null) {
				if (
					prevState.target === prevState.userSlot &&
					state.target !== state.userSlot
				) {
					nechtoService.selectedCard.value = null
				}
				if (
					prevState.currentPlayer === prevState.userSlot &&
					state.currentPlayer !== state.userSlot
				) {
					nechtoService.selectedCard.value = null
				}
				if (prevState.phase === 2 && state.phase === 3) {
					nechtoService.selectedCard.value = null
				}
				if (!prevState.showAllHand && state.showAllHand) {
					nechtoService.selectedCard.value = null
				}
				if (!prevState.chekCards && state.chekCards) {
					nechtoService.selectedCard.value = null
				}
				if (prevState.currentPanika && !state.currentPanika) {
					nechtoService.selectedCard.value = null
				}
			}
			if (nechtoService?.selectedTarget.value !== null) {
				if (
					prevState.target === prevState.userSlot &&
					state.target !== state.userSlot
				) {
					nechtoService.selectedTarget.value = null
				}
				if (
					prevState.currentPlayer === prevState.userSlot &&
					state.currentPlayer !== state.userSlot
				) {
					nechtoService.selectedTarget.value = null
				}
			}
			proccessSound(prevState, state)
		})
	}
}

function getUserSLot(state: NechtoState) {
	const slot = state.playerSlots.indexOf(window.gameApp.userId)
	return slot === -1 ? null : slot
}

export function useNechtoState() {
	maintainState()
	return nechtoState
}
