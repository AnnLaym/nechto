<template>
  <div class="corner">
    <PodskazkiXD />
    <Log />
  </div>
</template>
<script lang="ts" setup>
import { HtmlHTMLAttributes, ref } from 'vue';
import { getKnopkaName } from '../log';
import Log from './Log.vue';
import PodskazkiXD from './podskazkiXD.vue';


</script>

<style scoped>
.corner {
  position: fixed;
  right: 0px;
  height: 450px;
  width: 300px;
  bottom: 0px;
}
</style>
