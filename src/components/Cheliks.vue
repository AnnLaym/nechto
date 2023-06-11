<template>
    <div class="chel">
        <div>
            <div v-if="state.playerSlots[slot] === null && state.phase === 0" @click="service.playersJoin(slot)">сесть
            </div>
            <div v-else @click="slotClick(slot)">
                <span v-if="state.currentPlayer === slot">чичас играет:</span>
                <span v-if="service.selectedTarget.value === slot && state.phase === 2">на него:</span>

                {{ state.playerSlots[slot] ? state.playerNames[state.playerSlots[slot]!] : "" }}
            </div>
        </div>
        <img src="./avatars/1.png" class="kartinka">
        <div></div>
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

defineProps<{
    slot: Slot
}>()



</script>

<style scoped>
.kartinka {
    width: 100px;
    height: 100px;
    padding: 4px;
    border-radius: 27px;
}

.chel {
    background-color: #617777;
    border-radius: 31px;
    overflow: hidden;
    background: linear-gradient(180deg, #653E29 0%, rgba(101, 62, 41, 0) 100%);
    border-radius: 36px;
}
</style>
