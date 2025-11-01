<template>
    <div class="corner" :style="{ height: isLogCollapsed ? '168px' : '450px' }">
        <PodskazkiXD />
        <button class="toggleLog" @click="isLogCollapsed = !isLogCollapsed">
            {{ isLogCollapsed ? '▲' : '▼' }}
        </button>
        <Log v-if="!isLogCollapsed" />
    </div>
</template>

<script lang="ts" setup>
    import { ref } from 'vue'
    import Log from './Log.vue'
    import PodskazkiXD from './podskazkiXD.vue'

    const isLogCollapsed = ref(false)
</script>

<style scoped>
    .corner {
        position: fixed;
        right: 0;
        height: 450px;
        width: 300px;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.498);
        z-index: 200;
    }

    .toggleLog {
        position: absolute;
        bottom: 60px;
        right: 10px;
        z-index: 300;
        cursor: pointer;
        border: none;
        padding: 5px 10px;
        border-radius: 4px;
    }

    @media screen and (max-width: 1115px) and (min-height: 700px) {
        .corner {
            position: relative;
            width: 100%;
            flex: 1;
            overflow: hidden;
            display: flex;
            flex-flow: column;
        }
    }
</style>
