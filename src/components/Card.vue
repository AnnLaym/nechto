<template>
    <div class="card" :class="{ selectedCard: selected && !zoomed, zoomed, stolCard, vLoge }" @mousedown="mouseDaun()">
        <span class="logImya" v-if="vLoge && !zoomed">
            <div class="nameLog">{{ getCardName(card.id).toUpperCase() }}</div>
        </span>
        <div class="kartinka" :style="{
        'background-image': `url(/nechto/cards/${card.type !== 'panika'
            ? card.id !== 'zarajenie' ? card.id : `z${card.zNumber!}` : 'panika'}.png)`
    }" v-if="!vLoge || (vLoge && zoomed)">
            <div class="name">{{ getCardName(card.id).toUpperCase() }}</div>
            <div v-if="selected || zoomed" class="podkladka">
                <div class="opisanie" v-if="selected || zoomed">{{ getCardDescription(card.id) }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { getCardName, getKnopkaName, getCardDescription } from '../log';
import { Card, useNechtoService, useNechtoState } from '../service';

const service = useNechtoService()
const state = useNechtoState()
const zoomed = ref(false)
let cardTimer: number

window.addEventListener('mouseup', () => {
    zoomed.value = false;
    window.clearTimeout(cardTimer)
})

function mouseDaun() {
    cardTimer = window.setTimeout(() => {
        zoomed.value = true
    }, 250)
}

defineProps<{
    card: Card
    selected?: boolean
    stolCard?: boolean
    vLoge?: boolean
}>()
</script>

<style scoped>
@font-face {
    font-family: "matToni";
    /* Название вашего кастомного шрифта */
    src: url("/src/shrifty/asphalticscratchrusbylyajka.otf") format("opentype");
}

@font-face {
    font-family: "matToni3";
    /* Название вашего кастомного шрифта */
    src: url("/src/shrifty/BebasNeue Bold.otf") format("opentype");
}

@font-face {
    font-family: "matToni5";
    /* Название вашего кастомного шрифта */
    src: url("/src/shrifty/Bebas_Neue_Cyrillic.ttf");
}

@font-face {
    font-family: 'matToni2';
    src: url("/src/shrifty/HeadingPro-Regular.woff2") format("woff2"),
        url("/src/shrifty/HeadingPro-Regular.woff") format("woff");
}

@font-face {
    font-family: 'matToni10';
    src: url("/src/shrifty/HeadingPro-Light.ttf")
}

@font-face {
    font-family: "matToni1234";
    /* Название вашего кастомного шрифта */
    src: url("/src/shrifty/Montserrat-Regular.ttf");
}

.kartinka {
    /* background-image: url(cards/karantin.png) !important; */
    background-size: cover;
    flex: 1;
    user-select: none;
}

.zoomed {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(3);
    z-index: 100;
}


.zoomed .podkladka {
    border-radius: 0px;
    bottom: 5px;
    padding-top: 10px;
}

.zoomed .opisanie {
    font-family: matToni10 !important;
    font-size: 10px;
}

.card.selectedCard {
    zoom: 1.5;
    margin-top: -50;
}

.podkladka {
    background-color: black;
    border-radius: 25px;
    opacity: 0.7;
    position: absolute;
    bottom: 20px;
}

.nameLog {
    font-family: matToni1234 !important;
    font-size: 16px;
    padding: 0px;
    margin: 0px;
}

.card.vLoge:not(.zoomed) {
    padding: 0px;
    width: auto;
    margin: 0px;
    height: auto;
}

.card.vLoge.zoomed {
    z-index: 100;
}

.name {
    font-size: 25px;
    background: repeating-linear-gradient(to top, #8fbd82, white, white);
    -webkit-background-clip: text;
    transition: background 0.5s ease;
    background-clip: text;
    color: transparent;
    font-family: matToni5;
    filter: drop-shadow(2px 4px 6px black);

}

.opisanie {
    font-size: 14px;
    font-family: matToni2;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    max-width: 100%;

}

.card {
    background-color: black;
    padding: 4px;
    display: flex;
    justify-content: center;
    height: 180px;
    width: 130px;
    pointer-events: auto;
    margin: 5px;
    z-index: 2;
}

.stolCard:not(.zoomed) {
    width: 88px;
    height: 115px;
    padding: 3px;
    margin: 4px;
}

.stolCard .name {
    font-size: 18px;
}

@media screen and (max-width: 600px) {
    .card {
        height: 129px;
        width: 84px;
        margin: 1px;
    }

    .name {
        font-size: 17px;
    }
}
</style>
