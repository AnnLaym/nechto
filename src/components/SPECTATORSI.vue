<template>
        <div class="section">
            <div class="speki" v-if="state.teamsLocked && state.spectators.length">
                <span class="gap-1 margin-1"> {{ getKnopkaName('spektators') }} </span>
                <span v-for="chel in state.spectators"> {{ state.playerNames[chel] }} </span>
            </div>
            <div class="speki" v-if="!state.teamsLocked" @click="service.spectatorsJoin()">
                <span class="gap-1 margin-1"> {{ getKnopkaName('spektators') }} </span>
                <span v-for="chel in state.spectators"> {{ state.playerNames[chel] }} </span>
            </div>
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
.speki {
    display: inline-block;
    height: 28px;
    padding: 4px 6px;
    cursor: pointer;
    justify-content: center;
    background: #363739;
    user-select: none;
    white-space: nowrap;
    font-size: 16px;
    box-shadow: none;
    background-color: var(--surface-card) !important;
}

.section {
    text-align: center;
    position: fixed;
    right: 0;
    top: 0;
    gap: 10px;
}
</style>
