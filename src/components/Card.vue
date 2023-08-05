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
    font-family: 'matToni2';
    src: url("./src/shrifty/HeadingPro-Regular.woff2") format("woff2"),
        url("./src/shrifty/HeadingPro-Regular.woff") format("woff");
}

.kartinka {
    /* background-image: url(cards/karantin.png) !important; */
    background-size: cover;
    flex: 1;
    user-select: none;
}

.selectedCard {
    height: 200px;
    width: 150px;
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
    background: linear-gradient(to top, #b3e55e 0%, #b3e55e 33.33%, #ffffff 33.33%, #ffffff 100%);
    -webkit-background-clip: text;
    transition: background 0.5s ease;
    background-clip: text;
    color: transparent;
    font-family: matToni;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    white-space: nowrap;
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
