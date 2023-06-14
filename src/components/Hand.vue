<template>
    <div>
        <div class="knopki">
            <div v-if="service.selectedCard.value !== null && state.phase == 2 &&
                !state.currentPanika && state.userSlot === state.currentPlayer">
                <div @click="playCardClick()"> {{ getKnopkaName('sigratCartu') }} </div>
            </div>
            <div
                v-if="state.phase == 2 && state.currentPlayer == state.userSlot && !state.currentPanika && service.selectedCard.value !== null">
                <div @click="dropCardClick()"> {{ getKnopkaName('skinutCartu') }} </div>
            </div>
        </div>
        <div class="ruka">
            <div v-for="(card, index) in state.cards" @click="cardClick(index)">
                <Card :card="card" :selected="service.selectedCard.value == index"/>
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
    service.selectedCard.value = service.selectedCard.value === index ? null : index
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
    gap: 10px;
    position: fixed;
    bottom: 0;
    width: 100%;
    left: 0px;
    margin-bottom: 30px;
}
.knopki{
    display: flex;
    justify-content: center;
    gap: 20px;
}
.selected {
    height: 1px;
}
</style>
