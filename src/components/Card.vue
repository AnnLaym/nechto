<template>
    <div class="card" :class="{ selectedCard: selected }">
        <div class="kartinka" :style="{
            'background-image': `url(/nechto/cards/${card.type !== 'panika'
                ? card.id : 'panika'}.png)`
        }">
            <div class="name">{{ getCardName(card.id).toUpperCase() }}</div>
            <div v-if="selected" class="podkladka">
                <div class="opisanie" v-if="selected">{{ getCardDescription(card.id) }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { getCardName, getKnopkaName, getCardDescription } from '../log';
import { Card, useNechtoService, useNechtoState } from '../service';

const service = useNechtoService()
const state = useNechtoState()

defineProps<{
    card: Card
    selected?: boolean
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

.kartinka {
    /* background-image: url(cards/karantin.png) !important; */
    background-size: cover;
    flex: 1;
    user-select: none;
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

}

.card {
    background-color: black;
    padding: 5px;
    display: flex;
    justify-content: center;
    height: 180px;
    width: 130px;
}
</style>
