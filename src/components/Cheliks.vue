<template>
    <div
        class="chel"
        :class="{
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
    }"
        @click="slotClick(slot)">
        <div v-if="state.currentPlayer === slot" class="backgroundJ" />
        <div class="roditel">
            <div v-if="state.playerSlots[slot] === null && !state.teamsLocked" class="mini-roditel" @click="service.playersJoin(slot)">
                {{ getKnopkaName('sest') }}
            </div>
            <div v-else>
                <div class="suka" @click="slotClick(slot)">
                    <span class="text">
                        <span v-if="state.playerSlots[slot] !== null">
                            <span v-if="state.onlinePlayers.includes(state.playerSlots[slot]!)">
                                {{ state.playerNames[state.playerSlots[slot]!] }}
                            </span>
                            <span v-else>
                                <s class="offline">{{ state.playerNames[state.playerSlots[slot]!] }}</s>
                            </span>
                        </span>
                    </span>
                    <div class="host-cntrols">
                        <span v-if="state.hostId === state.userId" @click="service.removePLayer(state.playerSlots[slot])">
                            <i class="material-icons host-button settings-button" title="Remove">delete_forever</i>
                        </span>
                        <span v-if="state.hostId === state.userId && slot !== state.userSlot" @click="service.giveHost(state.playerSlots[slot]!)">
                            <i class="material-icons host-button settings-button" title="Give Host">military_tech</i>
                        </span>
                        <span v-if="state.playerSlots[slot] === state.hostId">
                            <i class="material-icons host-button settings-button" title="Game Host">star</i>
                        </span>
                        <span v-if="slot === state.userSlot" @click="handleClickChangeName()">
                            <i class="material-icons settings-button">edit</i>
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
    import { getKnopkaName } from '../log'
    import { Slot, useNechtoService, useNechtoState } from '../service'
    import { proccessSoundClient } from '../sound'
    import avatarSpace from './avatarSpace.vue'

    const service = useNechtoService()
    const state = useNechtoState()

    function setAvatarClick() {}

    function slotClick(index: number) {
        if (
            state.value.phase === 2 &&
            state.value.currentPlayer === state.value.userSlot &&
            (state.value.action == null ||
                state.value.currentPanika?.id === 'razDva' ||
                state.value.currentPanika?.id === 'ubiraysyaProch' ||
                state.value.currentPanika?.id === 'tolkoMejduNami' ||
                state.value.currentPanika?.id === 'davaiDrujit')
        ) {
            service.selectedTarget.value = service.selectedTarget.value !== index ? index : null
            proccessSoundClient()
        }
    }

    function handleClickChangeName() {
        ;(window as any).popup.prompt(
            {
                content: 'New name',
                value: state.value.playerNames[state.value.userId] || '',
            },
            (evt: any) => {
                if (evt.proceed && evt.input_value.trim()) {
                    service.changeName(evt.input_value.trim())
                    localStorage.userName = evt.input_value.trim()
                }
            },
        )
    }

    defineProps<{
        slot: Slot
        position: 'left' | 'right' | 'top' | 'bottom'
    }>()
</script>

<style scoped>
    @font-face {
        font-family: 'matToni123';
        src: url('/src/shrifty/Montserrat-Bold.ttf');
    }

    @font-face {
        font-family: 'matToni1234';
        src: url('/src/shrifty/Montserrat-Light.ttf');
    }

    .offline {
        text-decoration-color: gray;
    }

    .dver {
        position: absolute;
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
        top: 40px;
    }

    .dver.top.svoya,
    .dver.bottom.chujaya,
    .dver.left {
        right: -30px;
    }

    .dver.top.chujaya,
    .dver.bottom.svoya,
    .dver.right {
        left: -20px;
    }

    .dver.right.chujaya,
    .dver.left.svoya {
        top: 20px;
    }

    .dver.right.svoya,
    .dver.left.chujaya {
        bottom: -20px;
    }

    .chel:first-child .dver.top.chujaya,
    .chel:last-child .dver.top.svoya {
        bottom: -20px;
        top: initial;
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
        top: 4px;
        position: relative;
        display: inline-block;
        white-space: nowrap;
        font-family: matToni123;
    }

    .suka .text {
        max-width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: middle;
        display: inline-block;
        transition: opacity 0.3s ease;
        opacity: 1;
    }

    .host-cntrols {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 5px;
        opacity: 0;
        transition: opacity 0.3s ease;
        /* добавляем, чтобы не обрезалось */
        z-index: 10;
        pointer-events: auto;
    }

    .roditel:hover .text {
        opacity: 0;
    }

    .roditel:hover .host-cntrols {
        opacity: 1;
    }

    /* Убираем стандартные эффекты фона и outline у кнопок */
    .host-cntrols span,
    .host-cntrols i {
        background: none;
        outline: none;
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
            max-width: 100px;
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
            max-width: 50px;
        }
    }

    .chel.selected {
        box-shadow: 1px 1px 8px 3px red;
    }

    .slot-color-1 {
        background: linear-gradient(180deg, #a32a2a 0%, rgba(122, 52, 52, 0) 100%);
    }

    .slot-color-1.selected {
        box-shadow: 1px 1px 6px 4px #a32a2a;
    }

    .slot-color-2 {
        background: linear-gradient(180deg, #653e29 0%, rgba(101, 62, 41, 0) 100%);
    }

    .slot-color-2.selected {
        box-shadow: 1px 1px 6px 4px #a32a2a;
    }

    .slot-color-3 {
        background: linear-gradient(180deg, #c38144 0%, rgba(196, 129, 68, 0) 100%);
    }

    .slot-color-3.selected {
        box-shadow: 1px 1px 6px 4px #c38144;
    }

    .slot-color-4 {
        background: linear-gradient(180deg, #bdb35b 0%, rgba(132, 126, 79, 0) 100%);
    }

    .slot-color-4.selected {
        box-shadow: 1px 1px 6px 4px #bdb35b;
    }

    .slot-color-5 {
        background: linear-gradient(180deg, #6bb95e 0%, rgba(118, 157, 112, 0) 100%);
    }

    .slot-color-5.selected {
        box-shadow: 1px 1px 6px 4px #6bb95e;
    }

    .slot-color-6 {
        background: linear-gradient(180deg, #29572b 0%, rgba(41, 87, 43, 0) 100%);
    }

    .slot-color-6.selected {
        box-shadow: 1px 1px 6px 4px #29572b;
    }

    .slot-color-7 {
        background: linear-gradient(180deg, #227a80 0%, rgba(45, 110, 114, 0) 100%);
    }

    .slot-color-7.selected {
        box-shadow: 1px 1px 6px 4px #227a80;
    }

    .slot-color-8 {
        background: linear-gradient(180deg, #898989 0%, rgba(137, 137, 137, 0) 100%);
    }

    .slot-color-8.selected {
        box-shadow: 1px 1px 6px 4px #898989;
    }

    .slot-color-9 {
        background: linear-gradient(180deg, #318fc5 0%, rgba(44, 62, 124, 0) 100%);
    }

    .slot-color-9.selected {
        box-shadow: 1px 1px 6px 4px #318fc5;
    }

    .slot-color-10 {
        background: linear-gradient(180deg, #2c3e7c 0%, rgba(84, 59, 137, 0) 100%);
    }

    .slot-color-10.selected {
        box-shadow: 1px 1px 6px 4px #2c3e7c;
    }

    .slot-color-11 {
        background: linear-gradient(180deg, #543b89 0%, rgba(152, 75, 103, 0) 100%);
    }

    .slot-color-11.selected {
        box-shadow: 1px 1px 6px 4px #543b89;
    }

    .slot-color-0 {
        background: linear-gradient(180deg, #b24a7c 0%, rgba(213, 135, 135, 0) 100%);
    }

    .slot-color-0.selected {
        box-shadow: 1px 1px 6px 4px #b24a7c;
    }
</style>
