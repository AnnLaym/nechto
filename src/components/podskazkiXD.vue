<template>
  <div class="main">
    <div class="avatar">
      <img
        :src="reactCommonRoom().getPlayerAvatarURL(state.playerSlots[state.currentPlayer!]!) || ' /nechto/cards/avatar1.png'"
        class="otdelnii" v-if="(state.phase == 1)
          || (!state.isObmenReady && state.phase == 3 && state.action !== 'strah')
          || (state.phase == 2 && state.action == null)
          || (state.phase == 2 && state.action == 'podozrenie')
          || (state.phase == 2 && state.action === 'uporstvo')
          || (state.phase == 2 && state.currentPanika)
          || (state.phase == 2 && state.action == 'soblazn' && !state.isObmenReady)
          || (state.phase == 2 && (state.action === 'analiz' || state.action === 'viski'))
          || (state.phase == 2 && state.currentPanika?.id == 'davaiDrujit' && !state.isObmenReady)
          ">
      <img
        :src="reactCommonRoom().getPlayerAvatarURL(state.playerSlots[state.target!]!) || ' /nechto/cards/avatar1.png'"
        class="otdelnii" v-if="(state.isObmenReady && state.phase == 3)
          || (state.phase == 2 && (state.action === 'menyaemsyaMestami' || state.action === 'smaivayUdochki'))
          || (state.phase == 2 && state.action == 'soblazn' && state.isObmenReady)
          || (state.phase == 2 && state.currentPanika?.id == 'davaiDrujit' && state.isObmenReady)
          || (state.action === 'strah')
          || (state.phase == 2 && state.action === 'ognemet')">
    </div>
    <div class="text">
      <span class="obmen" v-if="state.phase == 3 && state.action !== 'strah'">
        <span class="current hueer" v-if="!state.isObmenReady">
          &nbsp;
          {{ state.playerNames[state.playerSlots[state.currentPlayer!]!] }}
        </span>
        <span class="obmen" v-if="state.isObmenReady">
          <span> {{ state.playerNames[state.playerSlots[state.target!]!] }} </span>
        </span>
        <span>
          <span>
            &nbsp;
            {{ getPodskazkaName('Выбирает карту для обмена') }}
            &nbsp;
          </span>
          <span>
            {{ getPodskazkaName('с') }}
          </span>
        </span>
        <span class="current hueer" v-if="state.isObmenReady">
          {{ state.playerNames[state.playerSlots[state.currentPlayer!]!] }}
        </span>
        <span class="obmen" v-if="!state.isObmenReady">
          <span> {{ state.playerNames[state.playerSlots[state.target!]!] }} </span>
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
        &nbsp;
        {{ getPodskazkaName('взять карту') }}
      </span>
      <span class="popitka" v-if="(state.action === 'strah')">
        <span class="current hueer"> {{ state.playerNames[state.playerSlots[state.target!]!] }}
        </span>
        &nbsp;
        {{ getPodskazkaName('смотрит карту') }}
      </span>
      <span class="popitka" v-if="state.phase == 2 && state.action == null">
        <span class="current hueer"> {{ state.playerNames[state.playerSlots[state.currentPlayer!]!] }}
        </span>
        &nbsp;
        {{ getPodskazkaName('играть') }}
      </span>
      <span class="popitka"
        v-if="state.phase == 2 && (state.action === 'menyaemsyaMestami' || state.action === 'smaivayUdochki')">
        <span class="current hueer"> {{ state.playerNames[state.playerSlots[state.target!]!] }}
        </span>
        &nbsp;
        {{ getPodskazkaName('свап местом') }}
      </span>
      <div class="popitka" v-if="state.phase == 2 && state.action === 'uporstvo'">
        <div class="current hueer"> {{ state.playerNames[state.playerSlots[state.currentPlayer!]!] }}
        </div>
        &nbsp;
        {{ getPodskazkaName('упорство') }}
      </div>
      <div class="popitka"
        v-if="state.phase == 2 && (state.action === 'analiz' || state.action === 'viski' || state.action === 'podozrenie')">
        <div class="current hueer"> {{ state.playerNames[state.playerSlots[state.currentPlayer!]!] }}
        </div>
        &nbsp;
        {{ getPodskazkaName('просмотр карты') }}
      </div>
      <div class="popitka" v-if="state.phase == 2 && state.action === 'ognemet'">
        <div class="current hueer"> {{ state.playerNames[state.playerSlots[state.target!]!] }}
        </div>
        &nbsp;
        {{ getPodskazkaName('сгореть') }}
      </div>
      <div class="popitka" v-if="state.phase == 2 && state.currentPanika
          && state.currentPanika.id !== 'tsepnayaReaksia'
          && state.action !== 'showUPS'">
        <div class="current hueer"> {{ state.playerNames[state.playerSlots[state.currentPlayer!]!] }}
        </div>
        &nbsp;
        {{ getPodskazkaName('панику') }}
      </div>
      <div v-if="state.action === 'showUPS'">
        <div class="current hueer"> {{ state.playerNames[state.playerSlots[state.currentPlayer!]!] }}
        </div>
        &nbsp;
        {{ getPodskazkaName('Показывает карты') }}
      </div>
      <div class="popitka"
        v-if="state.phase == 2 && state.currentPanika && state.currentPanika.id == 'tsepnayaReaksia'">
        {{ getPodskazkaName('панику-цепи') }}
      </div>
      <div class="popitka" v-if="state.phase == 0 && Object.values(state.playerSlots)
          .map(it => it !== null).filter(it => it === true).length < 4">
        {{ getPodskazkaName('для начала') }}
      </div>
      <div class="popitka" v-if="state.phase == 0 && Object.values(state.playerSlots)
          .map(it => it !== null).filter(it => it === true).length > 3">
        {{ getPodskazkaName('хост начать') }}
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

.hueer {
  white-space: nowrap;
  justify-content: center;
  display: flex;
  align-items: center;
}

.main {
  right: 0px;
  height: 100px;
  width: 300px;
  opacity: 70%;
  padding: 10px;
  margin-bottom: 50px;
  font-family: matToni1234;
  z-index: 1;
  -webkit-mask-image: none;
  display: flex;
}

.obmen {
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
  justify-content: center;
}

@media screen and (max-width: 1200px) {
  .main {
    height: auto;
    width: auto;
    margin-bottom: 0px;
    flex-flow: row;
  }

}
</style>
