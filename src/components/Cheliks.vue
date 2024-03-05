<template>
    <div class="chel" :class="`slot-color-${state.startSlotColor.value ? state.startSlotColor : slot}`"
        @click="slotClick(slot)">
        <div v-if="state.currentPlayer === slot" class="backgroundJ" />
        <div class="roditel">
            <div v-if="state.playerSlots[slot] === null &&
        (state.phase === 0 || !state.teamsLocked)" @click="service.playersJoin(slot)" class="mini-roditel">
                {{ getKnopkaName('sest') }}</div>
            <div v-else>
                <div class="suka" @click="slotClick(slot)">
                    <span v-if="service.selectedTarget.value === slot && state.phase === 2">на него:</span>
                    {{ reactCommonRoom().getPlayerAvatarURL(state.playerSlots[slot]!) || state.playerSlots[slot] ?
        state.playerNames[state.playerSlots[slot]!] : "" }}
                    <div class="host-cntrols">
                        <span @click="service.removePLayer(state.playerSlots[slot])">
                            <i className="material-icons host-button " title="Remove"> delete_forever</i>
                        </span>
                        <span @click="handleClickChangeName()" v-if="state.userSlot == slot">
                            <i className="material-icons settings-button">edit</i>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="state.umerSlots!.includes(slot) && state.phase !== 0" class="umer">
            УМЕР
        </div>
        <div class="mamaMami">
            <div class="kartinka">
                <div v-if="state.karantin[slot]" class="karantin">
                    <div class="skokaSidet">
                        {{ state.karantin[slot] }}
                    </div>
                </div>
                <div class="newTimer" v-if="state.timed ?
        (state.currentPanika !== null && state.currentPanika.id === 'tsepnayaReaksia' && !state.readyPlayers[slot])
        || (state.currentPanika == null && state.waitMoveSlot === slot)
        || (state.currentPanika !== null && state.currentPanika.id !== 'tsepnayaReaksia' && state.waitMoveSlot === slot)
        : false" :style="{ 'background-position': `${timerWidth}px 124px` }">
                    <i className="material-icons">
                        person
                    </i>
                </div>
                <div v-if="slot === state.userSlot" class="setAvatarButton"> </div>
                <img :src="reactCommonRoom().getPlayerAvatarURL(state.playerSlots[slot]!) || ' /nechto/cards/avatar1.png'"
                    class="otdelnii">
            </div>
        </div>
        <div v-if="state.dveriClient[slot]?.next" :class="position" class="dver svoya" />
        <div v-if="state.dveriClient[slot]?.prev" :class="position" class="dver chujaya" />
    </div>
</template>

<script lang="ts" setup>
import { Slot, useNechtoService, useNechtoState, reactCommonRoom } from '../service';
import { getCardName, getKnopkaName } from '../log';
import { computed } from '@vue/reactivity';
import { reactive, ref, watch } from 'vue';

const service = useNechtoService()
const state = useNechtoState()
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

function setAvatarClick() {

}
function slotClick(index: number) {
    if (state.value.phase === 2)
        service.selectedTarget.value = service.selectedTarget.value !== index ? index : null
}

function handleClickChangeName() {
    (window as any).popup.prompt(
        { content: "New name", value: state.value.playerNames[state.value.userId] || "" }, (evt: any) => {
            if (evt.proceed && evt.input_value.trim()) {
                service.changeName(evt.input_value.trim())
                localStorage.userName = evt.input_value.trim();
            }
        });
}

defineProps<{
    slot: Slot
    position: 'left' | 'right' | 'top' | 'bottom'
}>()

</script>

<style scoped>
@font-face {
    font-family: "matToni123";
    /* Название вашего кастомного шрифта */
    src: url("/src/shrifty/Montserrat-Bold.ttf");
}

@font-face {
    font-family: "matToni1234";
    /* Название вашего кастомного шрифта */
    src: url("/src/shrifty/Montserrat-Light.ttf");
}

.dver {
    position: absolute;
    z-index: 0;
    height: 61px;
    width: 50px;
    background-image: url(./img/dver1.png);
    background-size: contain;
    background-repeat: no-repeat;
    z-index: 5;
}

.dver.svoya {
    background-image: url(./img/dver2.png);
}

.dver.top,
.dver.bottom {
    top: 40px
}

.dver.top.svoya,
.dver.bottom.chujaya,
.dver.left {
    right: -30px
}

.dver.top.chujaya,
.dver.bottom.svoya,
.dver.right {
    left: -20px
}

.dver.right.chujaya,
.dver.left.svoya {
    top: 20px
}

.dver.right.svoya,
.dver.left.chujaya {
    bottom: -20px
}

.chel:first-child .dver.top.chujaya,
.chel:last-child .dver.top.svoya {
    bottom: -20px;
    top: initial
}

.chel:first-child .dver.bottom.svoya,
.chel:last-child .dver.bottom.chujaya {
    top: 20px;
    bottom: initial;
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
    z-index: 1;
    position: relative;
    overflow: hidden;
    padding-left: 0px;
    padding-right: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 5px;
}

.otdelnii {
    height: 100%;
    object-fit: fill;
    width: 100%;
}

.mini-roditel {
    text-decoration: underline;
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
}

.newTimer {
    position: absolute;
    height: 100%;
    background-image: url(./img/timerAvatar.png);
    width: 100%;
}

.suka {
    display: flex;
    flex-flow: row;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-family: matToni123;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100px;
    display: inline-block;
}

.host-cntrols {
    display: none;
}

.roditel {
    margin-top: 7px;
    font-family: matToni1234;
}

.umer {
    z-index: 4;
}

.roditel:hover .host-cntrols {
    display: block;
    gap: 5px;
}

.setAvatarButton {
    display: none;
    background-color: gray;
    opacity: 70%;
    width: 50px;
    height: 50px;
}

.chel {
    border-radius: 31px;
    overflow: hidden;
    border-radius: 36px;
    position: relative;
    overflow: visible;
    width: 136px;
    height: 157px;
}

.mamaMami {
    display: flex;
    justify-content: center;
    align-items: center;
}

.backgroundJ {
    width: 90%;
    position: absolute;
    height: 90%;
}

.slot-color-1 {
    background: linear-gradient(180deg, #A32A2A 0%, rgba(122, 52, 52, 0) 100%);
}

.slot-color-2 {
    background: linear-gradient(180deg, #653E29 0%, rgba(101, 62, 41, 0) 100%);
}

.slot-color-3 {
    background: linear-gradient(180deg, #C38144 0%, rgba(196, 129, 68, 0) 100%);
}

.slot-color-4 {
    background: linear-gradient(180deg, #BDB35B 0%, rgba(132, 126, 79, 0) 100%);
}

.slot-color-5 {
    background: linear-gradient(180deg, #6BB95E 0%, rgba(118, 157, 112, 0) 100%)
}

.slot-color-6 {
    background: linear-gradient(180deg, #29572B 0%, rgba(41, 87, 43, 0) 100%)
}

.slot-color-7 {
    background: linear-gradient(180deg, #227A80 0%, rgba(45, 110, 114, 0) 100%);
}

.slot-color-8 {
    background: linear-gradient(180deg, #898989 0%, rgba(137, 137, 137, 0) 100%);
}

.slot-color-9 {
    background: linear-gradient(180deg, #318FC5 0%, rgba(44, 62, 124, 0) 100%);
}

.slot-color-10 {
    background: linear-gradient(180deg, #2C3E7C 0%, rgba(84, 59, 137, 0) 100%);
}

.slot-color-11 {
    background: linear-gradient(180deg, #543B89 0%, rgba(152, 75, 103, 0) 100%);
}

.slot-color-0 {
    background: linear-gradient(180deg, #B24A7C 0%, rgba(213, 135, 135, 0) 100%);
}
</style>
