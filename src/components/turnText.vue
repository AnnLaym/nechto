<template>
    <div class="turnText">
        {{ getKnopkaName('yourTurn') }}
    </div>
</template>
<script lang="ts" setup>
    import { getKnopkaName } from '../log'
    import { useNechtoService, useNechtoState } from '../service'

    const service = useNechtoService()
    const state = useNechtoState()
</script>

<style scoped></style>
