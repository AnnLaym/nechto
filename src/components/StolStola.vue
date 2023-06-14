<template>
    <div class="stol">
        <div class="top">
            <div class="deki">
                <div>
                    <img src="./cards/1.png" class="deka">
                    <div>Deck: {{ state.deckSize }}</div>
                </div>
                <div>
                    <img src="./cards/3.png" class="deka">
                    <div>Diskard: {{ state.discardSize }}</div>
                </div>
            </div>
            <div> direction: {{ state.invertDirection }}</div>
        </div>
        <div v-if="state.currentPanika">
            <div> panika: {{ getCardName(state.currentPanika.id) }}</div>
        </div>
        <div> {{  state.time }}</div>
        <div v-if="state.phase === 1 && state.currentPlayer === state.userSlot" @click="service.grabCard()">
            {{ getKnopkaName('vzyatKartu') }}
        </div>
        <div v-if="(state.phase === 2 || state.phase === 3) && state.target === state.userSlot"
            @click="service.resolveAction(service.selectedCard.value)">
            {{ getKnopkaName("sigrat") }}</div>
        <div v-if="state.phase === 2 && state.target === state.userSlot" @click="service.resolvePassActin()">
            скип нахуй</div>
        <div v-if="state.phase === 3 && state.currentPlayer === state.userSlot"
            @click="service.vilojitCartuNaObmen(service.selectedCard.value)">
            {{ getKnopkaName('polojitKartuNaObmen') }}</div>
        <div v-if="state.phase === 3 && state.target === state.userSlot && state.isObmenReady"
            @click="service.resolveObmen(service.selectedCard.value!)">
            {{ getKnopkaName('polojitKartuNaObmen') }}</div>
        <div v-if="state.userSlot === state.currentPlayer && state.chekCards?.length && state.phase == 2">
            <div @click="service.resolvePassActin()">{{ getKnopkaName('ok') }}</div>
        </div>
        <div>
            <div v-if="state.chekCards?.length" class="uporstvo">
                <div v-for="card, index in state.chekCards">
                    <div @click="uporstvoClick(index)">
                        {{ card.id }}
                    </div>
                    <Card :card="card" :selected="false" class="jopa"/>
                </div>
            </div>
            <div v-if="state.showAllHand?.length !== 0">
                showcard:{{ state.showAllHand }}
            </div>
            <div> phase:{{ state.phase }} </div>

        </div>
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




</script>

<style scoped>
.stol {
    width: 750px;
    background-image: url(./img/stol.png);
    height: 400px;
    padding: 10px;
    border-radius: 100px;
    background-size: cover;
    flex: 1;
}
.jopa {
    height: 100px;
    width: 100px;
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
