<template>
    <div class="card" :class="{ selectedCard: selected }">
        <div class="kartinka">
            <div class="name">{{ getCardName(card.id) }}</div>
            <div class="opisanie" v-if="selected">{{ getCardDescription(card.id) }}</div>
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
.kartinka {
    background-image: url(./cards/1.png);
    background-size: cover;
    flex: 1;
}

.selectedCard {
    height: 200px;
    width: 150px;
}

.name {
    font-size: 20px;
}

.opisanie {
    font-size: 16px;
}

.card {
    background-color: black;
    padding: 5px;
    display: flex;
    justify-content: center;
}</style>
