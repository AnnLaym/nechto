<template>
    <div class="bodyLog">
        <div v-for="message in state.gameLog">
            <div v-if="message.action && !message.panika" class="messageCard">
                <span v-if="message.actors?.[0]">{{ state.playerNames[message.actors[0]] }} </span>
                <span> {{ getActionLog(message.action) }}</span>
            </div>
            <div v-else-if="message.card && !message.panika" class="messageCard">
                <span v-if="message.actors?.[0]"> {{ state.playerNames[message.actors[0]] }} </span>
                <span> {{ getCardLog(message.card.id) }} </span>
                <span v-if="message.actors?.[1]">{{ state.playerNames[message.actors[1]] }}</span>
                <div v-if="message.card" class="podskazkaLoga"> ({{ getCardName(message.card.id) }})</div>
            </div>
            <div v-if="message.card && message.panika" class="messageCard"> паника {{ message.card.id }}</div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { getCardName, getCardLog, getActionLog } from '../log';
import { useNechtoService, useNechtoState } from '../service';

const state = useNechtoState()


</script>

<style scoped>
.bodyLog {
    position: fixed;
    left: 0px;
    margin-left: 20px;
    height: 300px;
    width: 500px;
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
