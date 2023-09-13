<template>
    <div>
        <div class="ruka">
            <div v-for="(card, index) in state.cards" @click="cardClick(index)">
                <div v-if="service.selectedCard.value == index && state.action !== 'soblazn'" class="dveKnopki">
                    <div v-if="service.selectedCard.value !== null && state.phase == 2 &&
                        !state.currentPanika && state.userSlot === state.currentPlayer" class="knopki">
                        <div @click="playCardClick()"> {{ getKnopkaName('sigratCartu') }} </div>
                    </div>
                    <div v-if="state.phase == 2 && state.currentPlayer == state.userSlot && !state.currentPanika
                        && service.selectedCard.value !== null" class="knopki">
                        <div @click="dropCardClick()"> {{ getKnopkaName('skinutCartu') }} </div>
                    </div>
                </div>
                <Card :card="card" :selected="service.selectedCard.value == index ||
                    service.selectedZabivchivost1.value == index ||
                    service.selectedZabivchivost2.value == index ||
                    service.selectedZabivchivost3.value == index" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
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
        (state.value.userSlot === state.value.currentPlayer || state.value.userSlot === state.value.target)) {
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

function playCardClick() {
    if (service.selectedCard.value !== null)
        service.playCard(service.selectedCard.value, service.selectedTarget.value)
}

function dropCardClick() {
    if (service.selectedCard.value !== null)
        service.dropCard(service.selectedCard.value)
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
}

.dveKnopki {
    display: flex;
    flex-flow: row;
    gap: 10px;
    top: -80px;
    position: relative;
    font-size: 16px;
    justify-content: center;
    height: 50px;
}

.dveKnopki div:nth-child(2) {
    background: red;
}

.knopki {
    display: flex;
    justify-content: center;
    gap: 20px;
    background-color: green;
    border: 1;
    color: black;
    top: 60px
}

.selected {
    height: 1px;
}
</style>
