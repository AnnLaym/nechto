<template>
    <div class="turnText">
        {{ getKnopkaName('yourTurn') }}
    </div>
</template>
<script lang="ts" setup>
import { HtmlHTMLAttributes, computed, ref, watch } from 'vue';
import { getKnopkaName } from '../log';
import { Slot, reactCommonRoom, useNechtoService, useNechtoState } from '../service';

const service = useNechtoService();
const state = useNechtoState();
</script>

<style scoped></style>
