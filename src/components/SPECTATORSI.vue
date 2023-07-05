<template>
    <div class="speki" v-if="state.teamsLocked && state.spectators.length">
        <span class="gap-1 margin-1"> {{ getKnopkaName('spektators') }} </span>
        <span  v-for="chel in state.spectators"> {{ state.playerNames[chel] }} </span>
    </div>
    <div class="speki" v-if="!state.teamsLocked" @click="service.spectatorsJoin()">
        <span class="gap-1 margin-1"> {{ getKnopkaName('spektators') }} </span>
        <span  v-for="chel in state.spectators"> {{ state.playerNames[chel] }} </span>
    </div>
</template>

<script lang="ts" setup>
import { getCardName, getKnopkaName } from '../log';
import { useNechtoService, useNechtoState } from '../service';
import Card from './Card.vue';

const service = useNechtoService()
const state = useNechtoState()




</script>

<style scoped>
.speki{
    background-color: rgb(21, 32, 32);
    position: absolute;
    top: 0;
    width: 300px;
    height: 40px;
    right: 0px;
    gap: 10px;
    text-align: left;
}
</style>
