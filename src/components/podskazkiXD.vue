<template>
  <div class="main">
    <div class="avatar">
      <img
        :src="reactCommonRoom().getPlayerAvatarURL(state.playerSlots[state.currentPlayer!]!) || ' /nechto/cards/avatar1.png'"
        class="otdelnii" v-if="(state.phase == 1)
          || (!state.isObmenReady && state.phase == 3 && state.action !== 'strah')
          || (state.phase == 2 && state.action == null)
          || (state.phase == 2 && state.action === 'uporstvo')
          || (state.phase == 2 && state.currentPanika)
          || (state.phase == 2 && state.action == 'soblazn' && !state.isObmenReady)
          || (state.phase == 2 && (state.action === 'analiz' || state.action === 'viski'))
          || (state.phase == 2 && state.currentPanika?.id == 'davaiDrujit' && !state.isObmenReady)
          || (state.phase == 2 && state.action === 'ognemet')">
      <img :src="reactCommonRoom().getPlayerAvatarURL(state.playerSlots[state.target!]!) || ' /nechto/cards/avatar1.png'"
        class="otdelnii" v-if="(state.isObmenReady && state.phase == 3)
          || (state.phase == 2 && (state.action === 'menyaemsyaMestami' || state.action === 'smaivayUdochki'))
          || (state.phase == 2 && state.action == 'soblazn' && state.isObmenReady)
          || (state.phase == 2 && state.currentPanika?.id == 'davaiDrujit' && state.isObmenReady)
          || (state.action === 'strah')">
    </div>
    <div class="text">
      <span class="obmen" v-if="state.phase == 3 && state.action !== 'strah'">
        <span class="current hueer" v-if="!state.isObmenReady">
          {{ state.playerNames[state.playerSlots[state.currentPlayer!]!] }}
        </span>
        <span class="obmen" v-if="state.isObmenReady">
          <span> {{ state.playerNames[state.playerSlots[state.target!]!] }} </span>
        </span>
        <span>
          <span>
            {{ getPodskazkaName('Выбирает карту для обмена') }} </span>
          <span> {{ getPodskazkaName('c') }} </span>
        </span>
        <span class="current hueer" v-if="state.isObmenReady">
          {{ state.playerNames[state.playerSlots[state.currentPlayer!]!] }}
        </span>
        <span class="obmen" v-if="!state.isObmenReady">
          <span> {{ state.playerNames[state.playerSlots[state.target!]!] }} </span>
        </span>
        <span>
        </span>
      </span>
      <span class="popitka" v-if="(state.phase == 2 && state.action == 'soblazn' && !state.isObmenReady)
        || (state.phase == 2 && state.currentPanika?.id == 'davaiDrujit' && !state.isObmenReady)">
        <span> {{ state.playerNames[state.playerSlots[state.currentPlayer!]!] }} </span>
        <span> {{ getPodskazkaName('Выбирает карту для обмена') }} </span>
        <span class="obmen1">
          <span> {{ getPodskazkaName('c') }} </span>
          <span> {{ state.playerNames[state.playerSlots[state.target!]!] }} </span>
        </span>
      </span>
      <span class="popitka" v-if="(state.phase == 2 && state.action == 'soblazn' && state.isObmenReady)
        || (state.phase == 2 && state.currentPanika?.id == 'davaiDrujit' && state.isObmenReady)">
        {{ state.playerNames[state.playerSlots[state.target!]!] }}
        {{ getPodskazkaName('Выбирает карту для обмена') }}
        {{ getPodskazkaName('c') }}
        {{ state.playerNames[state.playerSlots[state.currentPlayer!]!] }}
      </span>
      <span class="popitka" v-if="state.phase == 1">
        <span class="current hueer"> {{ state.playerNames[state.playerSlots[state.currentPlayer!]!] }}
        </span>
        {{ getPodskazkaName('взять карту') }}
      </span>
      <span class="popitka" v-if="(state.action === 'strah')">
        <span class="current hueer"> {{ state.playerNames[state.playerSlots[state.target!]!] }}
        </span>
        {{ getPodskazkaName('смотрит карту') }}
      </span>
      <span class="popitka" v-if="state.phase == 2 && state.action == null">
        <span class="current hueer"> {{ state.playerNames[state.playerSlots[state.currentPlayer!]!] }}
        </span>
        {{ getPodskazkaName('играть') }}
      </span>
      <span class="popitka"
        v-if="state.phase == 2 && (state.action === 'menyaemsyaMestami' || state.action === 'smaivayUdochki')">
        <span class="current hueer"> {{ state.playerNames[state.playerSlots[state.target!]!] }}
        </span>
        {{ getPodskazkaName('свап местом') }}
      </span>
      <div class="popitka" v-if="state.phase == 2 && state.action === 'uporstvo'">
        <div class="current hueer"> {{ state.playerNames[state.playerSlots[state.currentPlayer!]!] }}
        </div>
        {{ getPodskazkaName('упорство') }}
      </div>
      <div class="popitka"
        v-if="state.phase == 2 && (state.action === 'analiz' || state.action === 'viski' || state.action === 'podozrenie')">
        <div class="current hueer"> {{ state.playerNames[state.playerSlots[state.currentPlayer!]!] }}
        </div>
        {{ getPodskazkaName('просмотр карты') }}
      </div>
      <div class="popitka" v-if="state.phase == 2 && state.action === 'ognemet'">
        <div class="current hueer"> {{ state.playerNames[state.playerSlots[state.currentPlayer!]!] }}
        </div>
        {{ getPodskazkaName('сгореть') }}
      </div>
      <div class="popitka" v-if="state.phase == 2 && (state.currentPanika)">
        <div class="current hueer"> {{ state.playerNames[state.playerSlots[state.currentPlayer!]!] }}
        </div>
        {{ getPodskazkaName('панику') }}
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
  right: 0px;
  height: 100px;
  width: 300px;
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

.obmen {
  display: flex;
  gap: 2px;
  flex-flow: column;
}

.text {
  justify-content: center;
  align-items: center;
  display: flex;
}

.otdelnii {
  height: 65px;
  width: 65px;
}

.obmen1 {
  display: flex;
  gap: 5px;
  flex-flow: row
}

.text {
  display: flex;
}

.popitka {
  display: flex;
  flex-wrap: wrap;
}
</style>
