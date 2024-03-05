<template>
    <div>
        <div class="ruka">
            <div v-for="(card, index) in state.cards" @click="cardClick(index)"
                v-if="!state.umerSlots?.includes(state.userSlot!)">
                <Card :card="card" :selected="service.selectedCard.value == index ||
                    service.selectedZabivchivost1.value == index ||
                    service.selectedZabivchivost2.value == index ||
                    service.selectedZabivchivost3.value == index" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { watch } from 'vue';
import { getCardName, getKnopkaName } from '../log';
import { useNechtoService, useNechtoState } from '../service';
import Card from './Card.vue';

const service = useNechtoService()
const state = useNechtoState()

function cardClick(index: number) {
    if (
        (state.value.phase === 2 ||
            (state.value.phase === 3 && state.value.userSlot === state.value.currentPlayer && !state.value.isObmenReady)
            || state.value.phase === 3 && state.value.userSlot === state.value.target && state.value.isObmenReady) &&
        (state.value.userSlot === state.value.currentPlayer || state.value.userSlot === state.value.target)
        || (state.value.phase === 2 && !state.value.readyPlayers[state.value.userSlot!]
            && state.value.currentPanika && state.value.currentPanika.id == "tsepnayaReaksia")
    ) {
        if ((state.value.currentPanika && state.value.currentPanika.id !== "zabivchivost")
            || !(state.value.currentPanika)) {
            service.selectedCard.value = service.selectedCard.value === index ? null : index;
        } else {
            if (service.selectedZabivchivost1.value === index) {
                service.selectedZabivchivost1.value = null;
            } else if (service.selectedZabivchivost2.value === index) {
                service.selectedZabivchivost2.value = null;
            } else if (service.selectedZabivchivost3.value === index) {
                service.selectedZabivchivost3.value = null;
            } else {
                if (service.selectedZabivchivost1.value === null) {
                    service.selectedZabivchivost1.value = index;
                } else if (service.selectedZabivchivost2.value === null) {
                    service.selectedZabivchivost2.value = index;
                } else if (service.selectedZabivchivost3.value === null) {
                    service.selectedZabivchivost3.value = index;
                }
            }
        }
    }
}
</script>

<style scoped>
.ruka {
    display: flex;
    padding: 19px;
    align-items: center;
    justify-content: center;
    height: 100px;
    gap: 4px;
    position: fixed;
    bottom: 0;
    width: 100%;
    left: 0px;
    margin-bottom: 30px;
    z-index: 1;
    pointer-events: none;

}
</style>
