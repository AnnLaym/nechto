<template>
    <div class="chel" :class="`slot-color-${slot}`">
        <div v-if="state.currentPlayer === slot" class="backgroundJ" />
        <div class="roditel">
            <div v-if="state.playerSlots[slot] === null &&
                (state.phase === 0 || !state.teamsLocked)" @click="service.playersJoin(slot)">
                {{ getKnopkaName('sest') }}</div>
            <div v-else @click="slotClick(slot)">
                <div class="suka">
                    <span v-if="service.selectedTarget.value === slot && state.phase === 2">на него:</span>
                    {{ state.playerSlots[slot] ? state.playerNames[state.playerSlots[slot]!] : "" }}
                    <div class="host-cntrols">
                        <span @click="service.removePLayer(state.playerSlots[slot])">
                            <i className="material-icons host-button" title="Remove"> delete_forever</i>
                        </span>
                        <span @click="handleClickChangeName()" v-if="state.userSlot == slot">
                            <i className="material-icons settings-button">edit</i>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <img src="./avatars/1.png" class="kartinka">
    </div>
</template>

<script lang="ts" setup>
import { Slot, useNechtoService, useNechtoState } from '../service';
import { getCardName, getKnopkaName } from '../log';
import { computed } from '@vue/reactivity';

const service = useNechtoService()
const state = useNechtoState()

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
}>()

</script>

<style scoped>
.kartinka {
    width: 120px;
    height: 120px;
    padding: 4px;
    border-radius: 27px;
}

.suka {
    display: flex;
    flex-flow: row;
    align-items: center;
    justify-content: center;
    gap: 10px;

}

.host-cntrols {
    display: none;
}

.roditel:hover .host-cntrols {
    display: flex;
    gap: 10px
}

.chel {
    border-radius: 31px;
    overflow: hidden;
    border-radius: 36px;
    position: relative;
    overflow: visible;
    max-width: 128px;
    max-height: 148px;
}

.backgroundJ {
    width: 90%;
    position: absolute;
    height: 90%;
}

.slot-color-1 {
    background: linear-gradient(180deg, #7A3434 0%, rgba(122, 52, 52, 0) 100%);
}

.slot-color-2 {
    background: linear-gradient(180deg, #653E29 0%, rgba(101, 62, 41, 0) 100%);
}

.slot-color-3 {
    background: linear-gradient(180deg, #C48144 0%, rgba(196, 129, 68, 0) 100%);
}

.slot-color-4 {
    background: linear-gradient(180deg, #D5C74A 0%, rgba(132, 126, 79, 0) 100%);
}

.slot-color-5 {
    background: linear-gradient(180deg, #769D70 0%, rgba(118, 157, 112, 0) 100%)
}

.slot-color-6 {
    background: linear-gradient(180deg, #29572B 0%, rgba(41, 87, 43, 0) 100%)
}

.slot-color-7 {
    background: linear-gradient(180deg, #2D6E72 0%, rgba(45, 110, 114, 0) 100%);
}

.slot-color-8 {
    background: linear-gradient(180deg, #898989 0%, rgba(137, 137, 137, 0) 100%);
}

.slot-color-9 {
    background: linear-gradient(180deg, #2C3E7C 0%, rgba(44, 62, 124, 0) 100%);
}

.slot-color-10 {
    background: linear-gradient(180deg, #543B89 0%, rgba(84, 59, 137, 0) 100%);
}

.slot-color-11 {
    background: linear-gradient(180deg, #984B67 0%, rgba(152, 75, 103, 0) 100%);
}

.slot-color-0 {
    background: linear-gradient(180deg, #D58787 0%, rgba(213, 135, 135, 0) 100%);
}
</style>
