import { NechtoState } from './service'
import startRoundZvukFile from './components/zvuki/startHoda.mp3'

const startRoundVzuk = new Audio(startRoundZvukFile)

export function proccessSound(prevState: NechtoState, newStat: NechtoState) {
	if (
		prevState.currentPlayer !== prevState.userSlot &&
		newStat.currentPlayer === newStat.userSlot
	) {
		startRoundVzuk.play()
	}
}
