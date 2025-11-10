<template>
    <div class="main">
        <div class="avatar">
            <img
                v-if="
                    state.phase === 1 ||
                    (!state.isObmenReady && state.phase === 3 && state.action !== 'strah') ||
                    (state.phase === 2 && state.action === null) ||
                    (state.phase === 2 && state.action === 'podozrenie') ||
                    (state.phase === 2 && state.action === 'uporstvo') ||
                    (state.phase === 2 && state.currentPanika && state.currentPanika?.id !== 'davaiDrujit') ||
                    (state.phase === 2 && state.action === 'soblazn' && !state.isObmenReady) ||
                    (state.phase === 2 && (state.action === 'analiz' || state.action === 'viski' || state.action === 'lovecraft')) ||
                    (state.phase === 2 && state.currentPanika?.id === 'davaiDrujit' && !state.isObmenReady)
                "
                :src="reactCommonRoom().getPlayerAvatarURL(state.playerSlots[state.currentPlayer!]!) || ' /nechto/cards/avatar1.png'"
                class="otdelnii" />
            <img
                v-if="
                    (state.isObmenReady && state.phase === 3) ||
                    (state.phase === 2 && (state.action === 'menyaemsyaMestami' || state.action === 'smativayUdochki')) ||
                    (state.phase === 2 && state.action === 'soblazn' && state.isObmenReady) ||
                    (state.phase === 2 && state.currentPanika?.id === 'davaiDrujit' && state.isObmenReady) ||
                    state.action === 'strah' ||
                    (state.phase === 2 && (state.action === 'ognemet' || state.action === 'necronomicon' || state.action === 'dynamite'))
                "
                :src="reactCommonRoom().getPlayerAvatarURL(state.playerSlots[state.target!]!) || ' /nechto/cards/avatar1.png'"
                class="otdelnii" />
        </div>
        <div class="text">
            <span v-if="state.phase === 3 && state.action !== 'strah'" class="obmen">
                <span v-if="!state.isObmenReady" class="current hueer nick">
                    &nbsp;
                    {{ state.playerNames[state.playerSlots[state.currentPlayer!]!] }}
                </span>
                <span v-if="state.isObmenReady" class="obmen">
                    <span class="nick">
                        {{ state.playerNames[state.playerSlots[state.target!]!] }}
                    </span>
                </span>
                <span>
                    <span>
                        &nbsp;
                        {{ getPodskazkaName('Выбирает карту для обмена') }}
                        &nbsp;
                    </span>
                    <span>
                        {{ getPodskazkaName('с') }}
                        &nbsp;
                    </span>
                </span>
                <span v-if="state.isObmenReady" class="current hueer nick">
                    {{ state.playerNames[state.playerSlots[state.currentPlayer!]!] }}
                </span>
                <span v-if="!state.isObmenReady" class="obmen">
                    <span class="nick">
                        {{ state.playerNames[state.playerSlots[state.target!]!] }}
                    </span>
                </span>
            </span>
            <span v-if="state.phase === 2 && state.action === 'soblazn' && !state.isObmenReady" class="popitka">
                <span class="nick">
                    {{ state.playerNames[state.playerSlots[state.currentPlayer!]!] }}
                </span>
                <span>{{ getPodskazkaName('Выбирает карту для обмена') }}</span>
                <span class="obmen1">
                    <span>{{ getPodskazkaName('c') }}</span>
                    <span class="nick">
                        {{ state.playerNames[state.playerSlots[state.target!]!] }}
                    </span>
                </span>
            </span>
            <span
                v-if="
                    (state.phase === 2 && state.action === 'soblazn' && state.isObmenReady) ||
                    (state.phase === 2 && state.currentPanika?.id === 'davaiDrujit' && state.isObmenReady && state.action !== 'strah')
                "
                class="popitka">
                <span class="nick">{{ state.playerNames[state.playerSlots[state.target!]!] }}</span>
                {{ getPodskazkaName('Выбирает карту для обмена') }}
                {{ getPodskazkaName('c') }}
                <span class="nick">{{ state.playerNames[state.playerSlots[state.currentPlayer!]!] }}</span>
            </span>
            <span v-if="state.phase === 1" class="popitka">
                <span class="current hueer nick">
                    {{ state.playerNames[state.playerSlots[state.currentPlayer!]!] }}
                </span>
                &nbsp;
                {{ getPodskazkaName('взять карту') }}
            </span>
            <span v-if="state.action === 'strah'" class="popitka">
                <span class="current hueer nick">
                    {{ state.playerNames[state.playerSlots[state.target!]!] }}
                </span>
                &nbsp;
                {{ getPodskazkaName('смотрит карту') }}
            </span>
            <span v-if="state.phase === 2 && state.action === null && !state.karantin[state.currentPlayer!]" class="popitka">
                <span class="current hueer nick">
                    {{ state.playerNames[state.playerSlots[state.currentPlayer!]!] }}
                </span>
                &nbsp;
                {{ getPodskazkaName('играть') }}
            </span>
            <span v-if="state.phase === 2 && state.action === null && state.karantin[state.currentPlayer!]" class="popitka">
                <span class="current hueer nick">
                    {{ state.playerNames[state.playerSlots[state.currentPlayer!]!] }}
                </span>
                &nbsp;
                {{ getPodskazkaName('сбросить') }}
            </span>
            <span v-if="state.phase === 2 && (state.action === 'menyaemsyaMestami' || state.action === 'smativayUdochki')" class="popitka">
                <span class="current hueer nick">
                    {{ state.playerNames[state.playerSlots[state.target!]!] }}
                </span>
                &nbsp;
                {{ getPodskazkaName('свап местом') }}
            </span>
            <div v-if="state.phase === 2 && state.action === 'uporstvo'" class="popitka">
                <div class="current hueer nick">
                    {{ state.playerNames[state.playerSlots[state.currentPlayer!]!] }}
                </div>
                &nbsp;
                {{ getPodskazkaName('упорство') }}
            </div>
            <div v-if="state.phase === 2 && (state.action === 'analiz' || state.action === 'podozrenie' || state.action === 'lovecraft')" class="popitka">
                <div class="current hueer nick">
                    {{ state.playerNames[state.playerSlots[state.currentPlayer!]!] }}
                </div>
                &nbsp;
                {{ getPodskazkaName('просмотр карты') }}
                <div class="current hueer nick">
                    {{ state.playerNames[state.playerSlots[state.target!]!] }}
                </div>
            </div>
            <div v-if="state.phase === 2 && state.action === 'ognemet'" class="popitka">
                <div class="current hueer nick">
                    {{ state.playerNames[state.playerSlots[state.target!]!] }}
                </div>
                &nbsp;
                {{ getPodskazkaName('сгореть') }}
            </div>
            <div v-if="state.phase === 2 && (state.action === 'necronomicon' || state.action === 'dynamite')" class="popitka">
                <div class="current hueer nick">
                    {{ state.playerNames[state.playerSlots[state.target!]!] }}
                </div>
                &nbsp;
                {{ getPodskazkaName('здохнуть') }}
            </div>
            <div
                v-if="
                    state.phase === 2 &&
                    state.currentPanika &&
                    ((state.currentPanika?.id !== 'tsepnayaReaksia' &&
                        state.currentPanika?.id !== 'vremyaPriznaniy' &&
                        state.currentPanika?.id !== 'davaiDrujit' &&
                        state.currentPanika?.id !== 'uups') ||
                        (state.currentPanika?.id === 'davaiDrujit' && !state.isObmenReady && state.target === null) ||
                        (state.currentPanika?.id === 'uups' && state.showAllHand === null))
                "
                class="popitka">
                <div class="current hueer nick">
                    {{ state.playerNames[state.playerSlots[state.currentPlayer!]!] }}
                </div>
                &nbsp;
                {{ getPodskazkaName('панику') }}
            </div>
            <div v-if="state.phase === 2 && state.currentPanika?.id === 'vremyaPriznaniy'" class="popitka">
                <div class="current hueer nick">
                    {{
                        state.vremyaPriznaniySlot !== null
                            ? state.playerNames[state.playerSlots[state.vremyaPriznaniySlot!]!]
                            : state.playerNames[state.playerSlots[state.currentPlayer!]!]
                    }}
                </div>
                {{ getPodskazkaName('панику') }}
            </div>
            <div v-if="(state.currentPanika?.id === 'uups' && state.showAllHand !== null) || state.action === 'viski'">
                <div class="current hueer nick">
                    {{ state.playerNames[state.playerSlots[state.currentPlayer!]!] }}
                </div>
                {{ getPodskazkaName('Показывает карты') }}
            </div>
            <div v-if="state.phase === 2 && state.currentPanika && state.currentPanika.id === 'tsepnayaReaksia'" class="popitka">
                {{ getPodskazkaName('панику-цепи') }}
            </div>
            <div
                v-if="
                    state.phase === 0 &&
                    Object.values(state.playerSlots)
                        .map((it) => it !== null)
                        .filter((it) => it === true).length < 4
                "
                class="popitka">
                {{ getPodskazkaName('для начала') }}
            </div>
            <div
                v-if="
                    state.phase === 0 &&
                    Object.values(state.playerSlots)
                        .map((it) => it !== null)
                        .filter((it) => it === true).length > 3
                "
                class="popitka">
                {{ getPodskazkaName('хост начать') }}
                <span v-if="state.startWithNechto">{{ getActionLog('s-nechto') }}</span>
                <span v-else>{{ getActionLog('bez-nechto') }}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { getActionLog, getPodskazkaName } from '../log'
    import { reactCommonRoom, useNechtoState } from '../service'

    const state = useNechtoState()
</script>

<style scoped>
    @font-face {
        font-family: 'matToni1234';
        src: url('/src/shrifty/Montserrat-Regular.ttf');
    }

    .hueer {
        white-space: nowrap;
        justify-content: center;
        display: flex;
        align-items: center;
    }

    .main {
        right: 0px;
        height: 100px;
        width: 300px;
        opacity: 70%;
        padding: 1px;
        margin-bottom: 50px;
        font-family: matToni1234;
        z-index: 1;
        -webkit-mask-image: none;
        display: flex;
    }

    .obmen {
        gap: 2px;
        flex-flow: column;
    }

    .text {
        justify-content: center;
        align-items: center;
        display: flex;
        padding: 0 2%;
    }

    .otdelnii {
        height: 65px;
        width: 65px;
    }

    .obmen1 {
        display: flex;
        gap: 5px;
        flex-flow: row;
    }

    .text {
        display: flex;
    }

    .popitka {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }

    .nick {
        display: inline-block;
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: middle;
    }

    @media screen and (max-width: 1200px) {
        .main {
            height: auto;
            width: auto;
            margin-bottom: 0px;
            flex-flow: row;
        }
    }
</style>
