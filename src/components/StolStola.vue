<template>
    <div class="stol">
        <div class="top">
            <div class="deki">
                <div :style="{ 'background-image': `url(/nechto/cards/1.png)` }" class="deka">
                    <div class="deka-count">{{ state.deckSize }}</div>
                </div>
                <div :style="{ 'background-image': `url(/nechto/cards/4.png)` }" class="deka">
                    <div class="deka-count">{{ state.discardSize }}</div>
                </div>
            </div>
        </div>
        <div v-if="state.currentPanika" class="action">
            <Card :card="state.currentCardPanik!" class="jopa" />
        </div>
        <div class="knopkee">
            <div v-if="state.winner == 'ebanati'" class="win"> {{ getKnopkaName('win') }} </div>
            <div v-if="state.winner == 'nechto and team'" class="win"> {{ getKnopkaName('win') }} </div>
            <div v-if="service.selectedCard.value! >= 0 && state.action !== 'soblazn'" class="knopkee hui">
                <div v-if="service.selectedCard.value !== null && state.phase == 2 &&
                    !state.currentPanika && state.userSlot === state.currentPlayer && state.chekCards?.length !== 0"
                    class="knopka">
                    <div @click="playCardClick()"> {{ getKnopkaName('sigratCartu') }} </div>
                </div>
                <div v-if="state.phase == 2 && state.currentPlayer == state.userSlot && !state.currentPanika
                    && service.selectedCard.value !== null && state.chekCards?.length !== 0" class="knopka">
                    <div @click="dropCardClick()"> {{ getKnopkaName('skinutCartu') }} </div>
                </div>
            </div>
            <div v-if="state.phase === 1 && state.currentPlayer === state.userSlot" @click="service.grabCard()"
                class="knopka">
                {{ getKnopkaName('vzyatKartu') }}
            </div>
            <div v-if="(state.phase === 2 && state.target === state.userSlot && state.showAllHand?.length == 0
                && state.chekCards?.length == null && state.action !== 'podozrenie')
                || (state.target === state.userSlot && state.phase === 2 && state.isObmenReady
                    && (state.action === 'ognemet' || state.action === 'menyaemsyaMestami'
                        || state.action === 'smaivayUdochki'))
                " @click="service.resolveAction(service.selectedCard.value)" class="knopka">
                {{ getKnopkaName("sigrat") }}</div>
            <div v-if="state.target === state.userSlot && state.phase === 3 && state.isObmenReady"
                @click="service.resolveAction(service.selectedCard.value)" class="knopka"> {{ getKnopkaName("sigrat") }}
            </div>
            <div v-if="(state.action === 'soblazn' && state.currentPlayer === state.userSlot && !state.isObmenReady) ||
                (state.currentPanika?.id === 'soblazn' && state.target === state.userSlot && state.isObmenReady)"
                class="knopka" @click="service.resolveAction(service.selectedCard.value!)">
                {{ getKnopkaName("polojitKartuNaObmen") }}
            </div>
            <div v-if="(state.action === 'soblazn' && state.target === state.userSlot && state.isObmenReady)" class="knopka"
                @click="service.soblaznResolve(service.selectedCard.value!)">
                {{ getKnopkaName("polojitKartuNaObmen") }}
            </div>
            <div v-if="state.phase === 2 && state.target === state.userSlot
                && ((state.action === 'ognemet' || state.action === 'menyaemsyaMestami'
                    || state.action === 'smaivayUdochki') || state.action === 'viski')
                " @click="service.resolvePassActin()" class="knopka">
                {{ getKnopkaName('pass') }}
            </div>
            <div v-if="state.phase === 3 && state.currentPlayer === state.userSlot && !state.isObmenReady"
                @click="service.vilojitCartuNaObmen(service.selectedCard.value)" class="knopka">
                {{ getKnopkaName('polojitKartuNaObmen') }}
            </div>
            <div v-if="state.phase === 3 && state.target === state.userSlot && state.isObmenReady"
                @click="service.resolveObmen(service.selectedCard.value!)" class="knopka">
                {{ getKnopkaName('polojitKartuNaObmen') }}
            </div>
            <div v-if="state.phase == 2 && state.userSlot === state.target
                && state.currentPanika?.id === 'davaiDrujit' && state.isObmenReady" class="knopka"
                @click="service.panicAction(service.selectedCard.value, service.selectedTarget.value!)">
                {{ getKnopkaName('polojitKartuNaObmen') }} </div>
            <div v-if="state.userSlot === state.currentPlayer && state.chekCards?.length
                && state.action !== `uporstvo` &&
                state.phase == 2
                " class="knopka" @click="service.resolvePassActin()">
                <div>{{ getKnopkaName('ok') }}
                </div>
            </div>
            <div v-if="state.currentPanika && state.userSlot === state.currentPlayer
                && state.currentPanika.id !== 'zabivchivost' && state.currentPanika.id !== 'davaiDrujit'"
                class="knopka" @click=" 
                    service.panicAction(service.selectedCard.value, service.selectedTarget.value!)">
                {{ getKnopkaName(`goPanika`) }}
            </div>
            <div v-if="state.currentPanika && state.userSlot === state.currentPlayer
                && state.currentPanika.id == 'zabivchivost'
                " class="knopka" @click="ZabivchivostClick()"> {{ getKnopkaName(`goPanika`) }}
            </div>
            <div v-if="state.currentPanika && state.userSlot === state.currentPlayer
                && state.currentPanika.id == 'davaiDrujit' && state.isObmenReady === false" class="knopka"
                @click="service.panicAction(service.selectedCard.value, service.selectedTarget.value!)"> {{
                    getKnopkaName(`goPanika`) }}
            </div>
        </div>
        <div>
            <div v-if="state.chekCards?.length" class="uporstvo">
                <div v-for=" card, index  in  state.chekCards " @click="uporstvoClick(index)">
                    <Card :card="card" :selected="false" class="jopa" />
                </div>
            </div>
            <div v-if="state.showAllHand?.length !== 0" class="uporstvo">
                <div v-for=" card, index  in  state.showAllHand ">
                    <Card :card="card" />
                </div>
            </div>
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

function ZabivchivostClick() {
    service.panicAction(null, null, service.selectedZabivchivost1.value, service.selectedZabivchivost2.value, service.selectedZabivchivost3.value);
    service.selectedZabivchivost1.value = null;
    service.selectedZabivchivost2.value = null;
    service.selectedZabivchivost3.value = null;

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
@font-face {
    font-family: "matToni1234";
    /* Название вашего кастомного шрифта */
    src: url("/src/shrifty/Montserrat-Regular.ttf");
}

.hui .knopka:nth-child(2) {
    background-color: #200E0E;
}

.hui .knopka:nth-child(1) {
    background-color: #0E1C0C;
}

.win {
    font-size: 20px;
    font-family: matToni1234;
}

.stol {
    width: 750px;
    background-image: url(./img/stol69.png);
    height: 400px;
    padding: 10px;
    border-radius: 100px;
    background-size: cover;
    flex: 1;
    font-family: matToni1234;
}

.knopka {
    background-color: rgba(18, 32, 41, 0.69);
    border: 1px;
    border-color: rgba(57, 57, 57, 1);
    border-style: solid;
    width: 140px;
    height: 35px;
    justify-content: center;
    align-items: center;
    display: flex;
    bottom: 0px;
    border-radius: 11px;
    margin-top: 2px;
}

.knopkee {
    justify-content: center;
    display: flex;
    position: relative;
    gap: 10px;
    height: 24%;
}

.action {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50%;
}

.jopa {
    max-height: 150px;
    max-width: 110px;
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
    height: 24%;
}

.deka {
    width: 50px;
    height: 70px;
    background-size: cover;
    font-size: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
