<template>
    <div v-for="message in state.gameLog"> {{ message }}</div>
</template>

<script lang="ts" setup>
import { getCardName } from '../log';
import { useNechtoService, useNechtoState } from '../service';

const state = useNechtoState()


</script>

<style scoped></style>
