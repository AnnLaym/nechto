import analizZvukFile from './components/zvuki/analiz.mp3'
import axeZvukFile from './components/zvuki/axe.mp3'
import clickSoundFile from './components/zvuki/click.mp3'
import zakolotilDverZvukFile from './components/zvuki/door.mp3'
import dynamiteZvukFile from './components/zvuki/dynamite.mp3'
import grabCardZvukFile from './components/zvuki/grabCard.mp3'
import pickZvukFile from './components/zvuki/heartPick.mp3'
import karantinZvukFile from './components/zvuki/karantin.mp3'
import lovecraftZvukFile from './components/zvuki/lovecraft.mp3'
import mimoZvukFile from './components/zvuki/mimo.mp3'
import nechtoZvukFile from './components/zvuki/nechto.mp3'
import nechtoWinZvukFile from './components/zvuki/nechto_win.mp3'
import necronomiconZvukFile from './components/zvuki/necronomicon.mp3'
import ognemetZvukFile from './components/zvuki/ognemet.mp3'
import nikakogoShashlikaZvukFile from './components/zvuki/ognetushitel.mp3'
import panikaZvukFile from './components/zvuki/panika.mp3'
import podozrenieZvukFile from './components/zvuki/podozrenie.mp3'
import soblaznZvukFile from './components/zvuki/soblazn.mp3'
import startGameWithNechtoZvukFile from './components/zvuki/start-with-nechto.mp3'
import startGameZvukFile from './components/zvuki/startGame.mp3'
import startRoundZvukFile from './components/zvuki/startHoda.mp3'
import strahZvukFile from './components/zvuki/strah.mp3'
import svapMestaZvukFile from './components/zvuki/svapMesta.mp3'
import uporstvoZvukFile from './components/zvuki/uporstvo.mp3'
import viskiZvukFile from './components/zvuki/viski.mp3'
import glyadiPoStoronamZvukFile from './components/zvuki/watch_your_back.mp3'
import zarajenieZvukFile from './components/zvuki/zarajenie.mp3'
import mneIZdesNelzyaZvukFile from './components/zvuki/zdes_ne_ploho.mp3'
import { NechtoState, offZvuk } from './service'
// TODO: добавить звук конца таймера

const sounds = {
    startRoundVzuk: new Audio(startRoundZvukFile),
    startGameVzuk: new Audio(startGameZvukFile),
    startGameWithNechtoVzuk: new Audio(startGameWithNechtoZvukFile),
    pickVzuk: new Audio(pickZvukFile),
    panikaVzuk: new Audio(panikaZvukFile),
    grabCardVzuk: new Audio(grabCardZvukFile),
    svapMestaVzuk: new Audio(svapMestaZvukFile),
    clickSound: new Audio(clickSoundFile),
    karantinVzuk: new Audio(karantinZvukFile),
    zakolotilDverVzuk: new Audio(zakolotilDverZvukFile),
    zarajenieVzuk: new Audio(zarajenieZvukFile),
    axeVzuk: new Audio(axeZvukFile),
    ognemetVzuk: new Audio(ognemetZvukFile),
    analizVzuk: new Audio(analizZvukFile),
    mimoVzuk: new Audio(mimoZvukFile), // TODO
    nechtoWinVzuk: new Audio(nechtoWinZvukFile),
    nechtoVzuk: new Audio(nechtoZvukFile),
    nikakogoShashlikaVzuk: new Audio(nikakogoShashlikaZvukFile), // TODO
    podozrenieVzuk: new Audio(podozrenieZvukFile),
    soblaznVzuk: new Audio(soblaznZvukFile), // TODO
    strahVzuk: new Audio(strahZvukFile),
    uporstvoVzuk: new Audio(uporstvoZvukFile),
    viskiVzuk: new Audio(viskiZvukFile),
    glyadiPoStoronamVzuk: new Audio(glyadiPoStoronamZvukFile),
    mneIZdesNelzyaVzuk: new Audio(mneIZdesNelzyaZvukFile),
    lovecraftVzuk: new Audio(lovecraftZvukFile),
    necronomiconVzuk: new Audio(necronomiconZvukFile),
    dynamiteVzuk: new Audio(dynamiteZvukFile),
}

sounds.startGameVzuk.volume = 0.3
sounds.startGameWithNechtoVzuk.volume = 0.3
sounds.startRoundVzuk.volume = 0.3
sounds.panikaVzuk.volume = 0.3

const tihieZvuki: (keyof typeof sounds)[] = [
    'mneIZdesNelzyaVzuk',
    'glyadiPoStoronamVzuk',
    'viskiVzuk',
    'uporstvoVzuk',
    'strahVzuk',
    'soblaznVzuk',
    'podozrenieVzuk',
    'nikakogoShashlikaVzuk',
    'mimoVzuk',
    'analizVzuk',
    'axeVzuk',
    'lovecraftVzuk',
    'necronomiconVzuk',
    'dynamiteVzuk',
]

const playSound = (sound: keyof typeof sounds) => {
    if (!offZvuk.value) {
        if (tihieZvuki.includes(sound)) {
            sounds[sound].volume = 0.5
        }
        sounds[sound].play()
    }
}
export function proccessSound(prevState: NechtoState, newStat: NechtoState) {
    if (!prevState.inited) return

    if (prevState.currentPlayer !== prevState.userSlot && newStat.currentPlayer === newStat.userSlot && !newStat.spectators.includes(newStat.userId)) {
        playSound('startRoundVzuk')
    }

    if (prevState.phase === 0 && newStat.phase === 1) {
        if (newStat.startWithNechto) {
            playSound('startGameWithNechtoVzuk')
        } else {
            playSound('startGameVzuk')
        }
    }

    if (!prevState.currentPanika && newStat.currentPanika) {
        playSound('panikaVzuk')
    }

    if (prevState.phase === 1 && newStat.phase === 2 && newStat.currentPlayer === newStat.userSlot) {
        playSound('grabCardVzuk')
    }

    if (prevState.phase === 2 && prevState.playerSlots.join('') !== newStat.playerSlots.join('')) {
        playSound('svapMestaVzuk')
    }

    if (prevState.gameLog.length !== newStat.gameLog.length) {
        playSound('clickSound')
        if (newStat.gameLog[newStat.gameLog.length - 1]['card']?.id === 'topor') {
            playSound('axeVzuk')
        }
    }
    if (newStat.gameLog.length > 2) {
        if (
            newStat.umerSlots!.join('').includes(newStat.playerSlots.indexOf(newStat.gameLog[newStat.gameLog.length - 1]['actors']?.[1]!).toString()) &&
            !prevState.umerSlots!.join('').includes(newStat.playerSlots.indexOf(newStat.gameLog[newStat.gameLog.length - 1]['actors']?.[1]!).toString()) &&
            prevState.umerSlots?.length !== newStat.umerSlots?.length
        ) {
            if (newStat.action === 'ognemet') {
                playSound('ognemetVzuk')
            } else if (newStat.action === 'necronomicon') {
                playSound('necronomiconVzuk')
            } else if (newStat.action === 'dynamite') {
                playSound('dynamiteVzuk')
            }
        }

        if (newStat.gameLog[newStat.gameLog.length - 1]['card']?.id === 'glyadiPoStoronam' && prevState.invertDirection !== newStat.invertDirection) {
            playSound('glyadiPoStoronamVzuk')
        }

        if (newStat.gameLog[newStat.gameLog.length - 1]['card']?.id === 'viski' && newStat.showAllHand?.length !== prevState.showAllHand?.length && newStat.showAllHand !== null) {
            playSound('viskiVzuk')
        }

        if (newStat.gameLog[newStat.gameLog.length - 1]?.card?.id === 'uporstvo' && prevState.gameLog[prevState.gameLog.length - 1]?.card?.id !== 'uporstvo') {
            playSound('uporstvoVzuk')
        }

        if (newStat.gameLog[newStat.gameLog.length - 1]['card']?.id === 'mneIZdesNePloha' && prevState.phase === 2 && newStat.phase === 3) {
            playSound('mneIZdesNelzyaVzuk')
        }

        if (newStat.gameLog[newStat.gameLog.length - 1]?.card?.id === 'strah' && newStat.action === 'strah') {
            playSound('strahVzuk')
        }

        if (newStat.gameLog[newStat.gameLog.length - 1]['card']?.id === 'podozrenie' && newStat.action === 'podozrenie') {
            playSound('podozrenieVzuk')
        }

        if (newStat.gameLog[newStat.gameLog.length - 1]['card']?.id === 'analiz' && newStat.action === 'analiz') {
            playSound('analizVzuk')
        }

        if (newStat.gameLog[newStat.gameLog.length - 1]['card']?.id === 'lovecraft' && newStat.action === 'lovecraft') {
            playSound('lovecraftVzuk')
        }
    }

    if (Object.values(prevState.readyPlayers).filter((it) => it === true).length !== Object.values(newStat.readyPlayers).filter((it) => it === true).length) {
        playSound('clickSound')
    }

    // TODO: сделать звук на каждое уменьшение карантина?
    if (!offZvuk.value) {
        for (let i = 0; i <= Object.values(prevState.karantin).length; i++) {
            if (prevState.karantin[i] !== 2 && newStat.karantin[i] === 2) {
                playSound('karantinVzuk')
            }
        }
        for (let i = 0; i <= Object.values(prevState.dveriClient).length; i++) {
            if (prevState.dveriClient[i] && newStat.dveriClient[i] && prevState.dveriClient[i]['next'] !== newStat.dveriClient[i]['next'] && !prevState.dveriClient[i]['next']) {
                playSound('zakolotilDverVzuk')
            }
        }
    }

    if (newStat.phase === 0 && newStat.gameLog.length > 7 && newStat.winner === 'nechto and team' && newStat.phase !== prevState.phase) {
        playSound('nechtoWinVzuk')
    }

    if (newStat.nechto === newStat.userSlot && prevState.nechto !== newStat.userSlot && (prevState.phase === 1 || prevState.phase === 2 || prevState.phase === 3)) {
        playSound('nechtoVzuk')
    }

    if (!prevState.zarajennie?.includes(prevState.userSlot!) && newStat.zarajennie?.includes(newStat.userSlot!)) {
        playSound('zarajenieVzuk')
    }
}

export function proccessSoundClient() {
    //if (!offZvuk.value) playSound('pickVzuk')
}
