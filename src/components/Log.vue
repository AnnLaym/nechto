<template>
    <div class="bodyLog">
        <div v-for="message in state.gameLog">
            <div v-if="message.action && !message.panika" class="messageCard">
                <span v-if="message.actors?.[0]" :style="{
                    'color':
                        colors[state.playerSlots.indexOf(message.actors?.[0])]
                }">
                    {{ state.playerNames[message.actors[0]] }}
                </span>
                <span> {{ getActionLog(message.action) }}</span>
                <span v-if="message.actors?.[1]" :style="{
                    'color':
                        colors[state.playerSlots.indexOf(message.actors?.[1])]
                }">
                    {{ state.playerNames[message.actors[1]] }} </span>
            </div>
            <div v-else-if="message.card && !message.panika" class="messageCard">
                <span v-if="message.actors?.[0]" :style="{
                    'color':
                        colors[state.playerSlots.indexOf(message.actors?.[0])]
                }"> {{ state.playerNames[message.actors[0]] }} </span>
                <span> {{ getCardLog(message.card.id) }} </span>
                <span v-if="message.actors?.[1]" :style="{
                    'color':
                        colors[state.playerSlots.indexOf(message.actors?.[1])]
                }">
                    {{ state.playerNames[message.actors[1]] }}</span>
                <div v-if="message.card" class="podskazkaLoga"> ({{ getCardName(message.card.id) }})</div>
            </div>
            <div v-if="message.card && message.panika" class="messageCard" :style="{ color: '#C71585' }">
                {{ getKnopkaName('panika') }} {{ message.card.id }}</div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { getCardName, getCardLog, getActionLog, getKnopkaName } from '../log';
import { useNechtoService, useNechtoState } from '../service';

const state = useNechtoState()
const colors = [
    '#D58787',
    '#7A3434',
    '#653E29',
    '#C48144',
    '#D5C74A',
    '#769D70',
    '#29572B',
    '#898989',
    '#2C3E7C',
    '#543B89',
    '#543B89',
    '#543B89',
    '#984B67'
]


</script>

<style scoped>
.bodyLog {
    position: fixed;
    left: 0px;
    height: 300px;
    width: 400px;
    bottom: 0px;
    background-color: black;
}

.messageCard {
    display: flex;
    flex-flow: row;
    justify-content: center;
    gap: 3px;
}

.podskazkaLoga {
    color: gray;
}
</style>
