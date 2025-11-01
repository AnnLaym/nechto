<template>
    <div class="mamaMami">
        <div class="kartinka">
            <div v-if="state.karantin[slot]" class="karantin">
                <div class="skokaSidet">
                    {{ state.karantin[slot] }}
                </div>
            </div>
            <div
                v-if="
                    state.timed && !state.paused
                        ? (state.currentPanika !== null && state.currentPanika.id === 'tsepnayaReaksia' && !state.readyPlayers[slot] && !state.umerSlots?.includes(slot)) ||
                          (state.currentPanika == null && state.waitMoveSlot === slot) ||
                          (state.currentPanika !== null && state.currentPanika.id !== 'tsepnayaReaksia' && state.waitMoveSlot === slot)
                        : (state.action === 'strah' && state.waitMoveSlot === slot) ||
                          (state.action === 'viski' && state.waitMoveSlot === slot) ||
                          (state.currentPanika?.id === 'uups' && state.showAllHand !== null && state.waitMoveSlot === slot) ||
                          (state.currentPanika?.id === 'vremyaPriznaniy' && state.showAllHand !== null && state.waitMoveSlot === slot)
                "
                class="newTimer"
                :style="{ 'background-position': `${timerWidth}px ${FRAME_WIDTH}px` }">
                <div class="timer-wrapper">
                    <i class="material-icons">person</i>
                    <span class="timer-value">{{ Math.floor((state.fullTimer - timePassed) / 1000) }}</span>
                </div>
            </div>
            <div v-if="slot === state.userSlot" class="setAvatarButton" />
            <img :src="reactCommonRoom().getPlayerAvatarURL(state.playerSlots[slot]!) || '/nechto/cards/avatar1.png'" class="otdelnii" />
            <img v-if="state.nechto === slot" :src="'/nechto/img/nechto2.png'" class="umer" />
            <img v-if="state.zarajennie?.includes(slot)" :src="'/nechto/img/zarazilsya.png'" class="umer" />
            <img v-if="state.umerSlots?.includes(slot) && state.phase !== 0" :src="'/nechto/img/umer(2).png'" class="umer" />
            <img v-if="state.survivors?.includes(slot) && state.phase === 0" :src="'/nechto/img/chel2.png'" class="umer" />
            <img v-if="state.umerZarajennim?.includes(slot) && state.phase === 0" :src="'/nechto/img/zarazilsyaNoUmer.png'" class="umer" />
            <img v-if="state.umerChelovekom?.includes(slot) && state.phase === 0" :src="'/nechto/img/umer(2).png'" class="umer" />
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { computed, ref, watch } from 'vue'
    import { reactCommonRoom, Slot, useNechtoService, useNechtoState } from '../service'

    const service = useNechtoService()
    const state = useNechtoState()
    const skrito = ref(false)
    const UPDATE_INTERVAL = 50
    const FRAME_WIDTH = 124
    const TOTAL_FRAMES = 7

    defineProps<{
        slot: Slot
    }>()

    const timePassed = ref(0)

    const timerWidth = computed(() => {
        const time = state.value.time - timePassed.value
        const tile = Math.round((FRAME_WIDTH * TOTAL_FRAMES * time) / state.value.fullTimer) * FRAME_WIDTH
        return tile >= 0 ? tile : 0
    })
    let interval: number

    watch(state, () => {
        window.clearInterval(interval)
        timePassed.value = 0
        if (state.value.time) {
            interval = window.setInterval(() => {
                timePassed.value += UPDATE_INTERVAL
            }, UPDATE_INTERVAL)
        }
    })
</script>

<style scoped>
    .mamaMami {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .otdelnii {
        height: 100%;
        object-fit: fill;
        width: 100%;
    }

    .umer {
        height: 100%;
        object-fit: fill;
        width: 100%;
        position: absolute;
        transition: opacity 0.5s ease;
    }

    .kartinka:hover .umer {
        opacity: 0;
        pointer-events: none;
    }

    .karantin {
        background-image: url(./img/sep.png);
        position: absolute;
        height: 100%;
        width: 100%;
        background-size: contain;
        z-index: 1;
        pointer-events: none;
    }

    .kartinka {
        width: 124px;
        height: 124px;
        border-radius: 27px;
        z-index: 0;
        position: relative;
        overflow: hidden;
        padding-left: 0px;
        padding-right: 0px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 5px;
    }

    .timerbar {
        position: absolute;
        height: 100%;
        background-color: #ceb5b57a;
        transition: all 0.2s;
        top: 4px;
    }

    .skokaSidet {
        position: absolute;
        background-color: #6c6c6c;
        color: white;
        left: 68px;
        bottom: 4px;
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 20;
        border: 2px solid white;
        cursor: pointer;
    }

    .newTimer {
        position: absolute;
        height: 100%;
        background-image: url(./img/timerAvatar.png);
        width: 100%;
    }

    .timer-wrapper {
        position: relative;
        display: inline-block;
        z-index: 1;
    }

    .timer-value {
        position: absolute;
        top: 50%;
        left: 100%;
        transform: translateY(-50%);
        margin-left: 4px;
    }

    .setAvatarButton {
        display: none;
        background-color: gray;
        opacity: 70%;
        width: 50px;
        height: 50px;
    }

    @media screen and (max-width: 1200) {
        .kartinka {
            height: 114px;
            width: 114px;
        }
    }

    @media screen and (max-width: 1115px) {
        .kartinka {
            width: 90px;
            height: 90px;
        }
    }

    @media screen and (max-width: 900px) {
        .kartinka {
            height: 56px;
            width: 60px;
            border-radius: 17px;
            margin-top: 2px;
        }
    }

    @media screen and (max-width: 800px) {
        .kartinka {
            height: 45px;
            width: 45px;
            border-radius: 10px;
        }
    }
</style>
