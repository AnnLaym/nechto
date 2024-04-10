<template>
    <div class="mamaMami">
        <div class="kartinka">
            <div v-if="state.karantin[slot]" class="karantin">
                <div class="skokaSidet">
                    {{ state.karantin[slot] }}
                </div>
            </div>
            <div class="newTimer" v-if="state.timed && !state.paused ?
                (state.currentPanika !== null && state.currentPanika.id === 'tsepnayaReaksia' && !state.readyPlayers[slot])
                || (state.currentPanika == null && state.waitMoveSlot === slot)
                || (state.currentPanika !== null && state.currentPanika.id !== 'tsepnayaReaksia' && state.waitMoveSlot === slot)
                : false
                " :style="{ 'background-position': `${timerWidth}px 124px` }">
                <i className="material-icons">
                    person
                </i>
            </div>
            <div v-if="slot === state.userSlot" class="setAvatarButton">
            </div>
            <img :src="reactCommonRoom().getPlayerAvatarURL(state.playerSlots[slot]!) || ' /nechto/cards/avatar1.png'"
                class="otdelnii">
            <img :src="false || '/nechto/img/nechto2.png'" class="umer" v-if="state.nechto === slot">
            <img :src="false || '/nechto/img/zarazilsya.png'" class="umer" v-if="state.zarajennie?.includes(slot)">
            <img :src="false || '/nechto/img/umer(2).png'" class="umer"
                v-if="state.umerSlots?.includes(slot) && state.phase !== 0">
        </div>
    </div>
</template>
<script lang="ts" setup>
import { HtmlHTMLAttributes, computed, ref, watch } from 'vue';
import { getKnopkaName } from '../log';
import { Slot, reactCommonRoom, useNechtoService, useNechtoState } from '../service';

const service = useNechtoService();
const state = useNechtoState();
const skrito = ref(false);

defineProps<{
    slot: Slot
}>()

const timerWidth = computed(() => {
    const time = state.value.time - timePassed.value
    //const percentage = (time / state.value.fullTimer) * 100;
    const tile = (Math.round((869 * time) / state.value.fullTimer)) * 124;
    return tile >= 0 ? tile : 0;
})
const timePassed = ref(0)
let interval: number

watch(state, () => {
    window.clearInterval(interval);
    timePassed.value = 0
    if (state.value.time) { //TODO: paused and ..
        interval = window.setInterval(() => {
            timePassed.value += 50
        }, 50)
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
}

.karantin {
    background-image: url(./img/sep.png);
    position: absolute;
    height: 100%;
    width: 100%;
    background-size: contain;
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
