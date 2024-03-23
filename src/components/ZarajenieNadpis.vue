<template>
  <div class="text" @click="skritZarajenie()" v-if="state.zarajennie?.includes(state.userSlot!) && !skrito">
    {{ getKnopkaName('zarajen') }}
  </div>
</template>
<script lang="ts" setup>
import { HtmlHTMLAttributes, ref } from 'vue';
import { getKnopkaName } from '../log';
import { useNechtoService, useNechtoState } from '../service';

const service = useNechtoService();
const state = useNechtoState();
const skrito = ref(false);

function skritZarajenie() {
  skrito.value = true
}
</script>

<style scoped></style>
