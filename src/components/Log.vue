<template>
    <div class="button" @click="clickLog()">X</div>
    <div class="bodyLog" ref="bodyLog" @scroll="handleScroll()" v-if="isClossed">
        <div class="startScroll" v-if="trogal" @click="startScroll()">
            лог на паузе
        </div>
        <div v-for="message in state.gameLog" class="message">
            <span v-if="message.action && !message.panika" class="messageCard">
                <span v-if="message.actors?.[0]" :style="{
        'color':
            colors[state.playerSlots.indexOf(message.actors?.[0])]
    }" class="actor">
                    {{ state.playerNames[message.actors[0]] }}
                </span>
                <span> {{ getActionLog(message.action) }}</span>
                <span v-if="!message.nechto && message.action === 'start-game'"> {{ getActionLog("bez-nechto") }}</span>
                <span v-if="message.actors?.[1]" :style="{
        'color':
            colors[state.playerSlots.indexOf(message.actors?.[1])]
    }" class="actor">
                    {{ state.playerNames[message.actors[1]] }} </span>
            </span>
            <span v-else-if="message.card && !message.panika" class="messageCard">
                <span v-if="message.actors?.[0]" :style="{
        'color':
            colors[state.playerSlots.indexOf(message.actors?.[0])]
    }" class="actor"> {{ state.playerNames[message.actors[0]] }} </span>
                <span> {{ getCardLog(message.card.id) }} </span>
                <span v-if="message.actors?.[1]" :style="{
        'color':
            colors[state.playerSlots.indexOf(message.actors?.[1])]
    }" class="actor">
                    {{ state.playerNames[message.actors[1]] }}</span>
                <span v-if="message.card" class="podskazkaLoga">
                    <Card :v-loge="true" :card="message.card" :zoomed="clicknutaCarta" />
                </span>
            </span>
            <span v-if="message.card && message.panika" class="messageCard" :style="{ color: '#C71585' }">
                {{ getKnopkaName('panika') }}
                <Card :v-loge="true" :card="message.card" :zoomed="clicknutaCarta" />
            </span>
            <span v-if="message.smetKrinj" class="messageCard">
                <span v-if="message.actors?.[0]" :style="{
        'color':
            colors[state.playerSlots.indexOf(message.actors?.[0])]
    }" class="actor">
                    {{ state.playerNames[message.actors?.[0]] }}</span>
                {{ getActionLog('smertKring') }}
            </span>
            <span v-if="message.smertDolbaeba" class="messageCard">
                <span v-if="message.actors?.[0]" :style="{
        'color':
            colors[state.playerSlots.indexOf(message.actors?.[0])]
    }" class="actor">
                    {{ state.playerNames[message.actors?.[0]] }}</span>
                {{ getActionLog('smertDolbaeb') }}
            </span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue';
import { getCardName, getCardLog, getActionLog, getKnopkaName } from '../log';
import { useNechtoService, useNechtoState } from '../service';
import Card from './Card.vue';

const bodyLog = ref<HTMLElement>()
var isClossed = ref(true);
const clicknutaCarta: number | null = null
const trogal = ref(false)
const neTrogal = computed(() => !trogal.value)
let lastScroll = 0
const state = useNechtoState()
const startScroll = () => {
    scrollBottom()
    trogal.value = false
}
const handleScroll = () => {
    if (bodyLog.value!.scrollTop < lastScroll && bodyLog.value!.scrollTop > 0) {
        trogal.value = true
    }
    lastScroll = bodyLog.value!.scrollTop
}
const scrollBottom = () => {
    bodyLog.value!.scrollTop = bodyLog.value!.scrollHeight
}
watch(state, async () => {
    if (neTrogal.value && bodyLog.value) {
        await nextTick()
        scrollBottom()
    }
})
const clickLog = () => {
    isClossed.value = !isClossed.value
}
const clickCard = () => {

}

const colors = [
    '#B24A7C',
    '#A32A2A',
    '#653E29',
    '#C38144',
    '#BDB35B',
    '#6BB95E',
    '#29572B',
    "#227A80",
    '#898989',
    '#318FC5',
    '#2C3E7C',
    '#543B89'
]

</script>

<style scoped>
@font-face {
    font-family: "matToni1234";
    /* Название вашего кастомного шрифта */
    src: url("/src/shrifty/Montserrat-Regular.ttf");
}

.plusik {
    display: flex;
    max-width: 10px;
    flex-direction: row;
}

.bodyLog {
    position: fixed;
    height: 300px;
    width: 320px;
    bottom: 0px;
    padding: 10px;
    margin-bottom: 50px;
    font-family: matToni1234;
    z-index: 100;
    overflow-y: auto;
    -webkit-mask-image: none;
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
    display: flex;
    flex-wrap: wrap;
    overflow-x: hidden;
}

.actor {
    text-overflow: ellipsis;
    max-width: 90px;
    overflow: hidden;
    display: flex;
    max-height: 19px;
    display: inline-block;
    align-items: flex-start;
    white-space: nowrap;
}

.startScroll {
    position: fixed;
    bottom: 50px;
    right: 100px;
    background-color: rgb(46, 27, 51);
    z-index: 1;
}

.podskazkaLoga {
    font-size: 16px;
    text-shadow: 0 0 3px black;
    color: #cecac1;
    cursor: pointer;
}

@media screen and (max-width: 1200px) {
    .bodyLog {
        position: relative;
        height: auto;
        width: auto;
        bottom: 0px;
        height: auto;
    }

}
</style>
