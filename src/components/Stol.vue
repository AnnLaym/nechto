<template>
    <div class="topovie" :class="{ 'full': activeSlots.top.length > 3 }">
        <Cheliks :slot="slot" v-for="slot in activeSlots.top" position="top" />
    </div>
    <div class="flex">
        <div v-for="slot in activeSlots.left" class="seredina">
            <Cheliks :slot="slot" position="left" />
        </div>
        <StolStola class="stol" />
        <div v-for="slot in activeSlots.right" class="seredina">
            <Cheliks :slot="slot" position="right" />
        </div>
    </div>
    <div class="nijnie" :class="{ 'full': activeSlots.bottom.length > 3 }">
        <Cheliks :slot="slot" v-for="slot in activeSlots.bottom" position="bottom" />
    </div>
</template>

<script lang="ts" setup>
import { Slot, useNechtoService, useNechtoState } from '../service';
import { getCardName, getKnopkaName } from '../log';
import { computed } from '@vue/reactivity';
import Cheliks from './Cheliks.vue';
import StolStola from './StolStola.vue';

const service = useNechtoService()
const state = useNechtoState()

const activeSlots = computed(() => {
    const slots = state.value.teamsLocked
        ? state.value.playerSlots.map((it, indx) => indx)
            .filter(i => state.value.playerSlots[i] !== null)
        : state.value.playerSlots.map((it, indx) => indx)
    if (slots.length === 4) {
        return {
            top: slots.splice(0, 2),
            right: slots.splice(0, 1),
            bottom: [],
            left: slots.splice(0, 1),
        }
    } else if (slots.length === 5) {
        return {
            top: slots.splice(0, 2),
            right: slots.splice(0, 1),
            bottom: slots.splice(0, 1),
            left: slots.splice(0, 1),
        }
    } else if (slots.length === 6) {
        return {
            top: slots.splice(0, 2),
            right: slots.splice(0, 1),
            bottom: slots.splice(0, 2).reverse(),
            left: slots.splice(0, 1),
        }
    } else if (slots.length === 7) {
        return {
            top: slots.splice(0, 3),
            right: slots.splice(0, 1),
            bottom: slots.splice(0, 2).reverse(),
            left: slots.splice(0, 1),
        }
    } else if (slots.length === 8) {
        return {
            top: slots.splice(0, 3),
            right: slots.splice(0, 1),
            bottom: slots.splice(0, 3).reverse(),
            left: slots.splice(0, 1),
        }
    } else if (slots.length === 9) {
        return {
            top: slots.splice(0, 4),
            right: slots.splice(0, 1),
            bottom: slots.splice(0, 3).reverse(),
            left: slots.splice(0, 1),
        }
    } else if (slots.length === 10) {
        return {
            top: slots.splice(0, 4),
            right: slots.splice(0, 1),
            bottom: slots.splice(0, 4).reverse(),
            left: slots.splice(0, 1),
        }
    } else if (slots.length === 11) {
        return {
            top: slots.splice(0, 5),
            right: slots.splice(0, 1),
            bottom: slots.splice(0, 4).reverse(),
            left: slots.splice(0, 1),
        }
    } else {
        return {
            top: slots.splice(0, 5),
            right: slots.splice(0, 1),
            bottom: slots.splice(0, 5).reverse(),
            left: slots.splice(0, 1),
        }
    }
})



</script>

<style scoped>
.seredina {
    display: flex;
    flex-flow: column;
    justify-content: center;
}

.topovie,
.nijnie {
    display: flex;
    justify-content: space-around;
    width: 70%;
    margin: auto;
}

.full {
    width: 85%;
    justify-content: space-between;
}

.topovie.full>div:first-child,
.topovie.full>div:last-child {
    position: relative;
    top: 50px;
}

.nijnie.full>div:first-child,
.nijnie.full>div:last-child {
    position: relative;
    bottom: 50px;
}

.stol {
    margin: 20px 40px;
}
</style>
