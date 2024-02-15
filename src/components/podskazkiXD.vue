<template>
  <div class="main">
    <div class="avatar">
      <img :src="reactCommonRoom().getPlayerAvatarURL(state.playerSlots[state.currentPlayer!]!) || ' /nechto/cards/avatar1.png'"
        class="otdelnii" v-if="(!state.isObmenReady && state.phase == 3)
          || state.phase == 1
          || (state.phase == 2 && state.action == null)">
      <img :src="reactCommonRoom().getPlayerAvatarURL(state.playerSlots[state.target!]!) || ' /nechto/cards/avatar1.png'"
        class="otdelnii" v-if="state.isObmenReady && state.phase == 3">
    </div>
    <div class="text">
      <div class="obmen" v-if="state.phase == 3">
        <div class="current player" v-if="!state.isObmenReady"> {{
          state.playerNames[state.playerSlots[state.currentPlayer!]!] }} </div>
        <div class="target player" v-if="state.isObmenReady"> {{ state.playerNames[state.playerSlots[state.target!]!] }}
        </div>
        {{ getPodskazkaName('Выбирает карту для обмена') }}
      </div>
      <div class="kartu" v-if="state.phase == 1">
        <div class="current player"> {{ state.playerNames[state.playerSlots[state.currentPlayer!]!] }} </div>
        {{ getPodskazkaName('взять карту') }}
      </div>
      <div class="kartu" v-if="state.phase == 2 && state.action == null">
        <div class="current player"> {{ state.playerNames[state.playerSlots[state.currentPlayer!]!] }} </div>
        {{ getPodskazkaName('играть') }}
      </div>
      <div class="swap"
        v-if="state.phase == 2 && (state.action === 'menyaemsyaMestami' || state.action === 'smaivayUdochki')">
        <div class="current player"> {{ state.currentPlayer }} </div>
        {{ getPodskazkaName('выбрать чела') }}
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { HtmlHTMLAttributes, ref } from 'vue';
import { getKnopkaName, getPodskazkaName } from '../log';
import { Slot, useNechtoService, useNechtoState, reactCommonRoom } from '../service';

const state = useNechtoState()
</script>

<style scoped>
@font-face {
  font-family: "matToni1234";
  /* Название вашего кастомного шрифта */
  src: url("/src/shrifty/Montserrat-Regular.ttf");
}

.main {
  position: fixed;
  right: 0px;
  height: 100px;
  width: 300px;
  top: 0px;
  background-color: black;
  opacity: 70%;
  padding: 10px;
  margin-bottom: 50px;
  font-family: matToni1234;
  z-index: 1;
  overflow-y: auto;
  -webkit-mask-image: none;
  display: flex;
}

.otdelnii {
  height: 50px;
  width: 50px;
}
</style>
