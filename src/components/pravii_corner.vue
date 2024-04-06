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
  background-color: rgba(0, 0, 0, 0.498);
  z-index: 200;
}

@media screen and (max-width: 1000px) and (min-height: 700px) {
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
