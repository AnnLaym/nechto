<template>
    <div class="stol">
        <div class="top">
            <div class="deki">
                <div>
                    <img src="./cards/1.png" class="deka">
                    <div>Deck: {{ state.deckSize }}</div>
                </div>
                <div>
                    <img src="./cards/4.png" class="deka">
                    <div>Discard: {{ state.discardSize }}</div>
                </div>
            </div>
        </div>
        <div v-if="state.currentPanika" class="action">
            <Card :card="state.currentCardPanik!" class="jopa" />
        </div>
        <div class="knopkee">
            <div v-if="state.phase === 1 && state.currentPlayer === state.userSlot" @click="service.grabCard()"
                class="knopka">
                {{ getKnopkaName('vzyatKartu') }}
            </div>
            <div v-if="(state.phase === 2 && state.target === state.userSlot && state.showAllHand?.length == 0)
                || (state.target === state.userSlot && state.phase === 2 && state.isObmenReady
                    && (state.action === 'ognemet' || state.action === 'menyaemsyaMestami'
                        || state.action === 'smaivayUdochki'))"
                @click="service.resolveAction(service.selectedCard.value)" class="knopka">
                {{ getKnopkaName("sigrat") }}</div>
            <div v-if="(state.action === 'soblazn' && state.currentPlayer === state.userSlot && !state.isObmenReady)"
                class="knopka" @click="service.resolveAction(service.selectedCard.value!)">
                {{ getKnopkaName("polojitKartuNaObmen") }}
            </div>
            <div v-if="(state.action === 'soblazn' && state.target === state.userSlot && state.isObmenReady)" class="knopka"
                @click="service.soblaznResolve(service.selectedCard.value!)">
                {{ getKnopkaName("polojitKartuNaObmen") }}
            </div>
            <div v-if="state.phase === 2 && state.target === state.userSlot
                && ((state.action === 'ognemet' || state.action === 'menyaemsyaMestami'
                    || state.action === 'smaivayUdochki') || state.action === 'viski')"
                @click="service.resolvePassActin()" class="knopka">
                {{ getKnopkaName('pass') }}</div>
            <div v-if="state.phase === 3 && state.currentPlayer === state.userSlot && !state.isObmenReady"
                @click="service.vilojitCartuNaObmen(service.selectedCard.value)" class="knopka">
                {{ getKnopkaName('polojitKartuNaObmen') }}</div>
            <div v-if="state.phase === 3 && state.target === state.userSlot && state.isObmenReady"
                @click="service.resolveObmen(service.selectedCard.value!)" class="knopka">
                {{ getKnopkaName('polojitKartuNaObmen') }}</div>
            <div v-if="state.userSlot === state.currentPlayer && state.chekCards?.length
                && state.action !== `uporstvo` &&
                state.phase == 2" class="knopka" @click="service.resolvePassActin()">
                <div>{{ getKnopkaName('ok') }}</div>
            </div>
            <div v-if="state.currentPanika && state.userSlot === state.currentPlayer
                && state.currentPanika.id !== 'zabivchivost'" class="knopka"
                @click=" service.panicAction(service.selectedCard.value, service.selectedTarget.value!)">{{
                    getKnopkaName(`goPanika`) }}</div>
            <div v-if="state.currentPanika && state.userSlot === state.currentPlayer
                && state.currentPanika.id == 'zabivchivost'" class="knopka" @click="ZabivchivostClick()"> {{
        getKnopkaName(`goPanika`) }}</div>
        </div>
        <div>
            <div v-if="state.chekCards?.length" class="uporstvo">
                <div v-for="card, index in state.chekCards" @click="uporstvoClick(index)">
                    <Card :card="card" :selected="false" class="jopa" />
                </div>
            </div>
            <div v-if="state.showAllHand?.length !== 0" class="uporstvo">
                <div v-for="card, index in state.showAllHand">
                    <Card :card="card" />
                </div>
            </div>
        </div>
        <div>{{ service.selectedZabivchivost1.value }}</div>
        <div>{{ service.selectedZabivchivost2.value }}</div>
        <div>{{ service.selectedZabivchivost3.value }}</div>
    </div>
</template>

<script lang="ts" setup>
import { Slot, useNechtoService, useNechtoState } from '../service';
import { getCardName, getKnopkaName } from '../log';
import { computed } from '@vue/reactivity';
import Cheliks from './Cheliks.vue';
import Card from './Card.vue';

const service = useNechtoService()
const state = useNechtoState()

function uporstvoClick(index: number) {
    service.resolveAction(index)
}

function ZabivchivostClick() {
    service.panicAction(null, null, service.selectedZabivchivost1.value, service.selectedZabivchivost2.value, service.selectedZabivchivost3.value);
    service.selectedZabivchivost1.value = null;
    service.selectedZabivchivost2.value = null;
    service.selectedZabivchivost3.value = null;

}

</script>

<style scoped>
.stol {
    width: 750px;
    background-image: url(./img/stol69.png);
    height: 400px;
    padding: 10px;
    border-radius: 100px;
    background-size: cover;
    flex: 1;
}

.knopka {
    background-color: rgb(103, 228, 105);
    color: black;
    border: 1px;
    width: 140px;
    height: 35px;
    justify-content: center;
    align-items: center;
    display: flex;
    bottom: 0px;
}

.knopkee {
    justify-content: center;
    display: flex;
    bottom: -114px;
    position: relative;

    gap: 10px;
}

.action {
    left: 0px;
    width: 50px;
    height: 70px;
}

.jopa {
    height: 150px;
    width: 90px;
}

.deki {
    padding: 20px;
    display: flex;
    justify-content: center;
    gap: 21px;
}

.uporstvo {
    display: flex;
    justify-content: center;
    flex-flow: row;
    gap: 8px
}

.top {
    margin-top: 10px;
}

.deka {
    width: 50px;
    height: 70px;
}
</style>
