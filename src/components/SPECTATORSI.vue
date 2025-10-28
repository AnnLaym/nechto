<template>
    <div class="section">
        <div v-if="state.teamsLocked && state.spectators.length" class="speki">
            <span class="spek">{{ getKnopkaName('spektators') }}</span>
            <span v-for="chel in state.spectators" class="spek">
                {{ state.playerNames[chel] }}
            </span>
        </div>
        <div v-if="!state.teamsLocked" class="speki" @click="service.spectatorsJoin()">
            <span class="spek">{{ getKnopkaName('spektators') }}</span>
            <span v-for="chel in state.spectators" class="spek">
                {{ state.playerNames[chel] }}
            </span>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { getKnopkaName } from '../log'
    import { useNechtoService, useNechtoState } from '../service'

    const service = useNechtoService()
    const state = useNechtoState()
</script>

<style scoped>
    .spek {
        padding-left: 3px;
    }
    .speki {
        display: inline-block;
        height: 28px;
        padding: 4px 6px !important;
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
