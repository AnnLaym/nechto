<template>
    <div class="chel" :class="{
        [`slot-color-${state.startSlotColor.value ? state.startSlotColor : slot}`]: true,
        'selected': service.selectedTarget.value === slot && state.phase === 2,
        'sosed': state.cards && state.phase === 2 && state.action === null
            ? state.cards![service.selectedCard.value!]?.target === 'sosed' && state.normSosed.includes(slot)
            : false,
        'any': state.cards && state.phase === 2 && state.action === null && state.currentPanika?.id !== 'tsepnayaReaksia'
            ? state.cards![service.selectedCard.value!]?.target === 'any'
            && state.normPlayer.includes(slot) : false,
        'selfOrSosed': state.cards && state.phase === 2 && state.action === null && state.currentPanika?.id !== 'tsepnayaReaksia'
            ? state.cards![service.selectedCard.value!]?.target === 'selfOrSosed'
            && (state.normSosed.includes(slot) || slot === state.userSlot)
            : false,
        'thirdplayer': state.currentPanika?.id !== 'tsepnayaReaksia' && state.action === null &&
            state.currentPanika?.id === 'razDva' && state.currentPlayer === state.userSlot && state.phase === 2
            ? state.normThirdPlayers.includes(slot) : false,
    }" @click="slotClick(slot)">
        <div v-if="state.currentPlayer === slot" class="backgroundJ" />
        <div class="roditel">
            <div v-if="state.playerSlots[slot] === null &&
        (state.phase === 0 || !state.teamsLocked)
        " @click="service.playersJoin(slot)" class="mini-roditel">
                {{ getKnopkaName('sest') }}</div>
            <div v-else>
                <div class="suka" @click="slotClick(slot)">
                    {{ reactCommonRoom().getPlayerAvatarURL(state.playerSlots[slot]!) || state.playerSlots[slot] ?
        state.playerNames[state.playerSlots[slot]!] : "" }}
                    <div class="host-cntrols">
                        <span @click="service.removePLayer(state.playerSlots[slot])"
                            v-if="state.hostId === state.userId">
                            <i className="material-icons host-button " title="Remove"> delete_forever</i>
                        </span>
                        <span @click="handleClickChangeName()" v-if="state.userSlot == slot">
                            <i className="material-icons settings-button">edit</i>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <avatarSpace :slot="slot" />
        <div v-if="state.dveriClient[slot]?.next" :class="position" class="dver svoya" />
        <div v-if="state.dveriClient[slot]?.prev" :class="position" class="dver chujaya" />
    </div>
</template>

<script lang="ts" setup>
import { Slot, useNechtoService, useNechtoState, reactCommonRoom } from '../service';
import { getCardName, getKnopkaName } from '../log';
import { computed } from '@vue/reactivity';
import { reactive, ref, watch } from 'vue';
import { proccessSoundClient } from '../sound';
import avatarSpace from './avatarSpace.vue'

const service = useNechtoService()
const state = useNechtoState()

function setAvatarClick() {

}

function slotClick(index: number) {
    if (state.value.phase === 2 && state.value.currentPlayer === state.value.userSlot
        && (state.value.action == null || state.value.currentPanika?.id === 'razDva'
            || state.value.currentPanika?.id === 'ubiraysyaProch')) {
        service.selectedTarget.value = service.selectedTarget.value !== index ? index : null
        proccessSoundClient()
    }
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
    z-index: 2;
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

.sosed {
    box-shadow: 1px 1px 9px 0px white;
}

.any {
    box-shadow: 1px 1px 9px 0px white;
}

.thirdplayer {
    box-shadow: 1px 1px 9px 0px white;
}

.selfOrSosed {
    box-shadow: 1px 1px 9px 0px white;
}

.mini-roditel {
    text-decoration: underline;
    cursor: pointer;
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
    white-space: nowrap;
}

.host-cntrols {
    display: none;
}

.roditel {
    margin-top: 7px;
    font-family: matToni1234;
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

.backgroundJ {
    width: 90%;
    position: absolute;
    height: 90%;
}

@media screen and (max-width: 1200) {
    .kartinka {
        height: 114px;
        width: 114px;
    }

    .chel {
        width: 130px;
        height: 148px;
        max-width: 100px;
    }

    .suka {
        font-size: 16px;
    }
}

@media screen and (max-width: 1115px) {
    .kartinka {
        width: 90px;
        height: 90px;
    }

    .chel {
        width: 100px;
        height: 122px;
    }

    .suka {
        font-size: 16px;
        max-width: 100px
    }

    .roditel {
        margin-top: 4px;
    }
}

@media screen and (max-width: 900px) {
    .kartinka {
        height: 56px;
        width: 60px;
        border-radius: 17px;
        margin-top: 2px;
    }

    .chel {
        width: 66px;
        height: 69px;
        border-radius: 19px;
    }

    .suka {
        font-size: 10px;
        max-width: 66px;
    }
}

@media screen and (max-width: 800px) {
    .kartinka {
        height: 45px;
        width: 45px;
        border-radius: 10px;
    }

    .chel {
        width: 50px;
        height: 69px;
        border-radius: 15px;
    }

    .suka {
        font-size: 10px;
        max-width: 50px
    }
}

.chel.selected {
    box-shadow: 1px 1px 8px 3px red;
}

.slot-color-1 {
    background: linear-gradient(180deg, #A32A2A 0%, rgba(122, 52, 52, 0) 100%);
}

.slot-color-1.selected {
    box-shadow: 1px 1px 6px 4px #A32A2A;
}

.slot-color-2 {
    background: linear-gradient(180deg, #653E29 0%, rgba(101, 62, 41, 0) 100%);
}

.slot-color-2.selected {
    box-shadow: 1px 1px 6px 4px #A32A2A;
}

.slot-color-3 {
    background: linear-gradient(180deg, #C38144 0%, rgba(196, 129, 68, 0) 100%);
}

.slot-color-3.selected {
    box-shadow: 1px 1px 6px 4px #C38144;
}

.slot-color-4 {
    background: linear-gradient(180deg, #BDB35B 0%, rgba(132, 126, 79, 0) 100%);
}

.slot-color-4.selected {
    box-shadow: 1px 1px 6px 4px #BDB35B;
}

.slot-color-5 {
    background: linear-gradient(180deg, #6BB95E 0%, rgba(118, 157, 112, 0) 100%)
}

.slot-color-5.selected {
    box-shadow: 1px 1px 6px 4px #6BB95E;
}

.slot-color-6 {
    background: linear-gradient(180deg, #29572B 0%, rgba(41, 87, 43, 0) 100%)
}

.slot-color-6.selected {
    box-shadow: 1px 1px 6px 4px #29572B;
}

.slot-color-7 {
    background: linear-gradient(180deg, #227A80 0%, rgba(45, 110, 114, 0) 100%);
}

.slot-color-7.selected {
    box-shadow: 1px 1px 6px 4px #227A80;
}

.slot-color-8 {
    background: linear-gradient(180deg, #898989 0%, rgba(137, 137, 137, 0) 100%);
}

.slot-color-8.selected {
    box-shadow: 1px 1px 6px 4px #898989;
}

.slot-color-9 {
    background: linear-gradient(180deg, #318FC5 0%, rgba(44, 62, 124, 0) 100%);
}

.slot-color-9.selected {
    box-shadow: 1px 1px 6px 4px #318FC5;
}

.slot-color-10 {
    background: linear-gradient(180deg, #2C3E7C 0%, rgba(84, 59, 137, 0) 100%);
}

.slot-color-10.selected {
    box-shadow: 1px 1px 6px 4px #2C3E7C;
}

.slot-color-11 {
    background: linear-gradient(180deg, #543B89 0%, rgba(152, 75, 103, 0) 100%);
}

.slot-color-11.selected {
    box-shadow: 1px 1px 6px 4px #543B89;
}

.slot-color-0 {
    background: linear-gradient(180deg, #B24A7C 0%, rgba(213, 135, 135, 0) 100%);
}

.slot-color-0.selected {
    box-shadow: 1px 1px 6px 4px #B24A7C;
}
</style>
