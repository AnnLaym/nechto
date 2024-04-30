<template>
	<div class="stol" :style="!state.invertDirection
		? 'background-image: url(/nechto/img/stolTrue.png)'
		: 'background-image: url(/nechto/img/stolFalse.png)'
		">
		<div class="top">
			<div class="deki">
				<div :style="{
		'background-image': state.isNextCardPanika
			? `url(/nechto/img/panica.png)`
			: `url(/nechto/cards/4.png)`,
	}" class="deka">
					<div class="deka-count">{{ state.deckSize }}</div>
				</div>
				<div :style="{
		'background-image': state.isPrevCardPanika
			? `url(/nechto/img/panica.png)`
			: `url(/nechto/cards/4.png)`,
	}" class="deka">
					<div class="deka-count">{{ state.discardSize }}</div>
				</div>
			</div>
		</div>
		<div class="knopkee">
			<div v-if="state.winner == 'ebanati'" class="win">
				{{ getKnopkaName('win-ebanati') }}
				<div v-if="state.nechto === state.userSlot || state.zarajennie?.includes(state.userSlot!)" class="win">
					{{ getKnopkaName('tiProigral') }} </div>
				<div v-else class="win">
					{{ getKnopkaName('tiPobedil') }} </div>
			</div>
			<div v-if="state.winner == 'nechto and team'" class="win">
				{{ getKnopkaName('win') }}
				<div v-if="state.nechto === state.userSlot || state.zarajennie?.includes(state.userSlot!)" class="win">
					{{ getKnopkaName('tiPobedil') }}
				</div>
				<div v-else class="win">
					{{ getKnopkaName('tiProigral') }}
				</div>
			</div>
			<div v-if="service.selectedCard.value! >= 0 && state.action !== 'soblazn'" class="knopkee hui">
				<div v-if="service.selectedCard.value !== null &&
		state.phase == 2 &&
		!state.currentPanika &&
		state.userSlot === state.currentPlayer &&
		state.chekCards?.length !== 0
		" class="knopka" @click="playCardClick()">
					{{ getKnopkaName('sigratCartu') }}
				</div>
				<div v-if="state.phase == 2 &&
		state.currentPlayer == state.userSlot &&
		!state.currentPanika &&
		service.selectedCard.value !== null &&
		state.chekCards?.length !== 0
		" class="knopka" @click="dropCardClick()">
					{{ getKnopkaName('skinutCartu') }}
				</div>
			</div>
			<div v-if="state.phase === 1 && state.currentPlayer === state.userSlot" @click="service.grabCard()"
				class="knopka">
				{{ getKnopkaName('vzyatKartu') }}
			</div>
			<div v-if="(state.phase === 2 &&
		state.target === state.userSlot &&
		state.showAllHand?.length == 0 &&
		state.chekCards?.length == null &&
		state.action !== 'podozrenie' &&
		state.action !== 'strah') ||
		(state.target === state.userSlot &&
			state.phase === 2 &&
			!state.isObmenReady &&
			state.action !== 'strah' &&
			(
				(state.action === 'ognemet' && chekSgorelaJopaIliNet)
				|| (
					(state.action === 'menyaemsyaMestami'
						|| state.action === 'smaivayUdochki')
					&& passPriSmeneTaburetok)
			)
		)
		" @click="service.resolveAction(service.selectedCard.value)" class="knopka">
				{{ getKnopkaName('sigrat') }}
			</div>
			<div v-if="state.phase === 2 &&
		state.target === state.userSlot &&
		state.action == 'soblazn' &&
		state.isObmenReady
		" @click="service.resolveAction(service.selectedCard.value)" class="knopka">
				{{ getKnopkaName('sigrat') }}
			</div>
			<div v-if="state.target === state.userSlot &&
		state.phase === 3 &&
		state.isObmenReady &&
		state.action !== 'strah' && chekhandForPlayNeObmen
		" @click="service.resolveAction(service.selectedCard.value)" class="knopka">
				{{ getKnopkaName('sigrat') }}
			</div>
			<div v-if="state.action === 'soblazn' &&
		state.currentPlayer === state.userSlot &&
		!state.isObmenReady
		" class="knopka" @click="service.resolveAction(service.selectedCard.value!)">
				{{ getKnopkaName('polojitKartuNaObmen') }}
			</div>
			<div v-if="state.action === 'soblazn' &&
		state.target === state.userSlot &&
		state.isObmenReady
		" class="knopka" @click="service.soblaznResolve(service.selectedCard.value!)">
				{{ getKnopkaName('polojitKartuNaObmen') }}
			</div>
			<div v-if="state.phase === 2 &&
		state.target === state.userSlot &&
		(state.action === 'ognemet' ||
			state.action === 'menyaemsyaMestami' ||
			state.action === 'smaivayUdochki' ||
			state.action === 'viski')
		" @click="service.resolvePassActin()" class="knopka">
				{{ getKnopkaName('pass') }}
			</div>
			<div v-if="state.phase === 3 &&
		state.currentPlayer === state.userSlot &&
		!state.isObmenReady
		" @click="service.vilojitCartuNaObmen(service.selectedCard.value)" class="knopka">
				{{ getKnopkaName('polojitKartuNaObmen') }}
			</div>
			<div v-if="state.phase === 3 &&
		state.target === state.userSlot &&
		state.isObmenReady &&
		state.action !== 'strah'
		" @click="service.resolveObmen(service.selectedCard.value!)" class="knopka">
				{{ getKnopkaName('polojitKartuNaObmen') }}
			</div>
			<div v-if="state.phase == 2 &&
		state.userSlot === state.target &&
		state.currentPanika?.id === 'davaiDrujit' &&
		state.isObmenReady
		" class="knopka" @click="
		service.panicAction(service.selectedCard.value, service.selectedTarget.value!)
		">
				{{ getKnopkaName('polojitKartuNaObmen') }}
			</div>
			<div v-if="(state.userSlot === state.currentPlayer &&
		state.chekCards?.length &&
		state.action !== `uporstvo` &&
		state.phase == 2) ||
		(state.action === 'strah' && state.userSlot === state.target)
		" class="knopka" @click="service.resolvePassActin()">
				<div>{{ getKnopkaName('ok') }}</div>
			</div>
			<div v-if="state.currentPanika &&
		state.userSlot === state.currentPlayer &&
		state.currentPanika.id !== 'zabivchivost' &&
		state.currentPanika.id !== 'davaiDrujit' &&
		state.currentPanika.id !== 'tsepnayaReaksia' &&
		state.action !== 'showUPS'
		" class="knopka" @click="
		service.panicAction(service.selectedCard.value, service.selectedTarget.value!)
		">
				{{ getKnopkaName(`goPanika`) }}
			</div>
			<div v-if="state.currentPanika &&
		state.userSlot === state.currentPlayer &&
		state.currentPanika.id == 'zabivchivost'
		" class="knopka" @click="ZabivchivostClick()">
				{{ getKnopkaName(`goPanika`) }}
			</div>
			<div v-if="state.currentPanika && !state.readyPlayers[state.userSlot!]
		&& state.currentPanika.id == 'tsepnayaReaksia'
		&& !state.spectators.includes(state.playerSlots[state.userSlot!]!)
		&& !state.umerSlots!.includes(state.userSlot!)
		" class="knopka" @click="
		service.panicAction(service.selectedCard.value, service.selectedTarget.value!)
		">
				{{ getKnopkaName(`goPanika`) }}
			</div>
			<div v-if="state.currentPanika &&
		state.userSlot === state.currentPlayer &&
		state.currentPanika.id == 'davaiDrujit' &&
		state.isObmenReady === false
		" class="knopka" @click="
		service.panicAction(service.selectedCard.value, service.selectedTarget.value!)
		">
				{{ getKnopkaName(`goPanika`) }}
			</div>
		</div>
		<div v-if="state.currentPanika && state.action !== 'showUPS'" class="action">
			<Card :card="state.currentCardPanik!" class="uporstvo1" :stolCard="true" />
		</div>
		<div>
			<div class="uporstvo" v-if="state.chekCards?.length">
				<div class="uporstvo1">
					<span>
						{{ getKnopkaName('карты') }}
					</span>
					<span v-if="state.currentPanika?.id === 'tolkoMejduNami'">
						{{ state.playerNames[state.playerSlots[state.target!]!] }}
					</span>
					<span v-else-if="state.currentPanika?.id !== 'tolkoMejduNami'">
						{{ state.playerNames[state.playerSlots[state.currentPlayer!]!] }}
					</span>
				</div>
				<div v-if="state.chekCards?.length" class="uporstvo1">
					<div v-for="(card, index) in state.chekCards" @click="uporstvoClick(index)" class="cursorsk">
						<Card :card="card" :stolCard="true" />
					</div>
				</div>
			</div>
			<div v-if="state.showAllHand?.length !== undefined" class="uporstvo">
				<div class="uporstvo1">
					<span v-if="state.showAllHand?.length !== undefined">
						{{ getKnopkaName('карты') }}
					</span>
					<span v-if="state.showAllHand?.length !== undefined">
						{{ state.playerNames[state.playerSlots[state.currentPlayer!]!] }}
					</span>
				</div>
				<div class="uporstvo1">
					<div v-for="(card, index) in state.showAllHand">
						<Card :card="card" :stolCard="true" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { Slot, useNechtoService, useNechtoState } from '../service';
import { getCardName, getKnopkaName } from '../log';
import { computed } from '@vue/reactivity';
import Cheliks from './Cheliks.vue';
import Card from './Card.vue';

const service = useNechtoService();
const state = useNechtoState();

function uporstvoClick(index: number) {
	service.resolveAction(index);
}

function ZabivchivostClick() {
	service.panicAction(
		null,
		null,
		service.selectedZabivchivost1.value,
		service.selectedZabivchivost2.value,
		service.selectedZabivchivost3.value,
	);
	service.selectedZabivchivost1.value = null;
	service.selectedZabivchivost2.value = null;
	service.selectedZabivchivost3.value = null;
}

function playCardClick() {
	if (service.selectedCard.value !== null)
		service.playCard(service.selectedCard.value, service.selectedTarget.value);
}

function dropCardClick() {
	if (service.selectedCard.value !== null) service.dropCard(service.selectedCard.value);
}

const chekhandForPlayNeObmen = computed(() => state.value.cards?.some(card =>
	card.id === 'mimo' || card.id === 'netUjSpasibo' || card.id === 'strah'))
const chekSgorelaJopaIliNet = computed(() => state.value.cards?.some(card => card.id === 'nikakogoShahlika'));
const passPriSmeneTaburetok = computed(() => state.value.cards?.some(card => card.id === 'mneIZdesNePloha'));

</script>

<style scoped>
@font-face {
	font-family: 'matToni1234';
	/* Название вашего кастомного шрифта */
	src: url('/src/shrifty/Montserrat-Regular.ttf');
}

.hui .knopka:nth-child(2) {
	background-color: #200e0e
}

.hui .knopka:nth-child(1) {
	background-color: #0e1c0c;
}

.win {
	font-size: 20px;
	font-family: matToni1234;
}

.stol {
	width: 750px;
	height: 400px;
	padding: 10px;
	border-radius: 100px;
	background-size: cover;
	flex: 1;
	font-family: matToni1234;
}

.knopka {
	background-color: rgba(18, 32, 41, 0.69);
	border: 1px;
	border-color: rgba(57, 57, 57, 1);
	border-style: solid;
	width: 140px;
	height: 35px;
	justify-content: center;
	align-items: center;
	display: flex;
	bottom: 0px;
	border-radius: 11px;
	margin-top: 2px;
	cursor: pointer;
}

.knopkee {
	justify-content: center;
	display: flex;
	position: relative;
	gap: 10px;
	height: 20%;
}

.cursorsk {
	cursor: pointer;
}

.action {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 50%;
}

.jopa {
	max-height: 60px;
	max-width: 60px;
}

.deki {
	padding: 20px;
	display: flex;
	justify-content: center;
	gap: 21px;
}

.uporstvo {
	display: flex;
	justify-content: center;
	flex-flow: column;
	gap: 8px;
}

.uporstvo1 {
	display: flex;
	justify-content: center;
	flex-flow: row;
	gap: 8px;
}

.top {
	margin-top: 10px;
	height: 20%;
}

.deka {
	width: 35px;
	height: 50px;
	background-size: cover;
	font-size: 30px;
	display: flex;
	justify-content: center;
	align-items: center;
}

@media screen and (max-width: 1200px) {
	.stol {
		width: 660px;
		height: 350px;
		flex: unset;
	}
}

@media screen and (max-width: 1115px) {
	.stol {
		width: 455px;
		height: 225px;
		flex: unset;
	}
}

@media screen and (max-width: 640px) {
	.stol {
		width: 370px;
		height: 201px;
		flex: unset;
	}

	.knopka {
		width: 70px;
		height: 20px;
	}

	.deki {
		padding: 9px;
	}

	.deka {
		width: 27px;
		height: 35px;
		font-size: 24px;
	}
}

@media screen and (max-width: 550px) {
	.stol {
		width: 390px;
		height: 220px;
		flex: unset;
	}
}

@media screen and (max-width: 431px) {
	.stol {
		width: 273px;
		height: 140px;
		flex: unset;
	}
}

@media screen and (max-width: 400px) {
	.stol {
		width: 180px;
		height: 90px;
		flex: unset;
	}
}
</style>
