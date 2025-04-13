<template>
    <div class="root-plashki">
      <div  class="plashka"> {{ getKnopkaName('phashka') }}</div> 
      <div  class="plashka"> {{ getKnopkaName('plahskaTwo') }}</div> 
      <div> гагагага </div>
    </div>
</template>
<script lang="ts" setup>
import { HtmlHTMLAttributes, ref } from 'vue';
import { getKnopkaName } from '../log';


</script>

<style scoped>
.plashka {
    display: flex;
    position: relative;
    top: 10px;
    left: 10px;
    color: gray;
}
</style>
