<template>
    <div v-if="state.zarajennie?.includes(state.userSlot!) && !skrito" class="texto" @click="skritZarajenie()">
        {{ getKnopkaName('zarajen') }}
    </div>
</template>
<script lang="ts" setup>
    import { ref } from 'vue'
    import { getKnopkaName } from '../log'
    import { useNechtoService, useNechtoState } from '../service'

    const service = useNechtoService()
    const state = useNechtoState()
    const skrito = ref(false)

    function skritZarajenie() {
        skrito.value = true
    }
</script>

<style scoped>
    .texto {
        font-size: 20px;
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        z-index: 10000;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 10px 20px;
        border-radius: 8px;
        max-width: 80%;
        text-align: center;
        white-space: nowrap;
    }
</style>
