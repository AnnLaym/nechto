import { NechtoState, offZvuk } from './service'
import startRoundZvukFile from './components/zvuki/startHoda.mp3'
import startGameZvukFile from './components/zvuki/startGame.mp3'
import pickZvukFile from './components/zvuki/heartPick.mp3'
import panicaZvukFile from './components/zvuki/panica.mp3'
import grabCardZvukFile from './components/zvuki/grabCard.mp3'

const startRoundVzuk = new Audio(startRoundZvukFile)
const startGameVzuk = new Audio(startGameZvukFile)
const pickVzuk = new Audio(pickZvukFile)
const panicaVzuk = new Audio(panicaZvukFile)
const grabCardVzuk = new Audio(grabCardZvukFile)

panicaVzuk.volume = 0.3
pickVzuk.volume = 0.7

export function proccessSound(prevState: NechtoState, newStat: NechtoState) {
	if (
		prevState.currentPlayer !== prevState.userSlot &&
		newStat.currentPlayer === newStat.userSlot &&
		!newStat.spectators.includes(newStat.userId) &&
		offZvuk.value
	) {
		startRoundVzuk.play()
	}
	if (prevState.phase === 0 && newStat.phase === 1 && !offZvuk.value) {
		startGameVzuk.play()
	}
	if (!prevState.currentPanika && newStat.currentPanika && !offZvuk.value) {
		panicaVzuk.play()
	}
	if (prevState.phase === 1 && newStat.phase === 2 && !offZvuk.value && newStat.currentPlayer === newStat.userSlot) {
		grabCardVzuk.play()
	}
}

export function proccessSoundClient() {
	if (!offZvuk.value) pickVzuk.play()
}
