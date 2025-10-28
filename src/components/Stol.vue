<template>
    <div class="slotMain">
        <div class="topovie" :class="{ full: activeSlots.top.length > 3 }">
            <Cheliks v-for="slot in activeSlots.top" :slot="slot" position="top" />
        </div>
        <div class="stolStolaStola">
            <div v-for="slot in activeSlots.left" class="seredina">
                <Cheliks :slot="slot" position="left" />
            </div>
            <StolStola class="stol" />
            <div v-for="slot in activeSlots.right" class="seredina">
                <Cheliks :slot="slot" position="right" />
            </div>
        </div>
        <div class="nijnie" :class="{ full: activeSlots.bottom.length > 3 }">
            <Cheliks v-for="slot in activeSlots.bottom" :slot="slot" position="bottom" />
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { computed } from 'vue'
    import { useNechtoService, useNechtoState } from '../service'
    import Cheliks from './Cheliks.vue'
    import StolStola from './StolStola.vue'

    const service = useNechtoService()
    const state = useNechtoState()

    const activeSlots = computed(() => {
        let slots

        if (state.value.teamsLocked) {
            // TODO: всегда state.value.survivors
            slots = state.value.playerSlots.map((_, i) => i).filter((i) => state.value.playerSlots[i] !== null)
        } else {
            slots = state.value.playerSlots.map((_, i) => i)
        }
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

    .stolStolaStola {
        display: flex;
    }

    .full {
        width: 85%;
        justify-content: space-between;
    }

    .topovie.full > div:first-child,
    .topovie.full > div:last-child {
        position: relative;
        top: 50px;
    }

    .nijnie.full > div:first-child,
    .nijnie.full > div:last-child {
        position: relative;
        bottom: 50px;
    }

    .stol {
        margin: 20px 40px;
    }

    .slotMain {
        z-index: 100;
        user-select: none;
    }

    @media screen and (max-width: 1200px) {
        .stol {
            margin: 10px 20px;
        }
    }

    @media screen and (max-width: 600px) {
        .stol {
            margin: 4px 8px;
        }
    }
</style>
