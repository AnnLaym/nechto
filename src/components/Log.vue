<template>
    <div class="button" @click="clickLog()">X</div>
    <div v-if="isClossed">
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
                    {{ getKnopkaName('panika') }} {{ getCardName(message.card.id) }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { getCardName, getCardLog, getActionLog, getKnopkaName } from '../log';
import { useNechtoService, useNechtoState } from '../service';

const state = useNechtoState()
var isClossed: boolean = true;

const clickLog = () => {
    isClossed = !isClossed
}

const colors = [
    '#D58787',
    '#7A3434',
    '#653E29',
    '#C48144',
    '#D5C74A',
    '#769D70',
    '#29572B',
    "#2D6E72",
    '#898989',
    '#2C3E7C',
    '#543B89',
    '#984B67'
]


</script>

<style scoped>
@font-face {
    font-family: "matToni1234";
    /* Название вашего кастомного шрифта */
    src: url("/src/shrifty/Montserrat-Regular.ttf");
}
.bodyLog {
    position: fixed;
    right: 0px;
    height: 300px;
    width: 300px;
    bottom: 0px;
    background-color: black;
    opacity: 70%;
    padding: 10px;
    margin-bottom: 50px;
    font-family: matToni1234;
    z-index: 1;
}

.button {
    position: absolute;
    bottom: 10px;
    right: 10px;
    width: 30px;
    height: 30px;
    cursor: pointer;
    background-color: gray;
}

.messageCard {
    display: flex;
    flex-flow: row;
    justify-content: left;
    gap: 3px;
}

.podskazkaLoga {
    font-size: 16px;
    text-shadow: 0 0 3px black;
    color: #cecac1;
}
</style>
