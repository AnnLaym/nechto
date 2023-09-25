<template>
    <div v-if="state.inited">
        <PhoneXd />
        <Plashka/>
        <DashMenu :bottom-buttons="bottomButtons" :number-settings="numberSettings" />
        <SPECTATORSI />
        <Stol />
        <Log />
        <Hand />
    </div>
</template>

<script setup lang="ts">
import DashMenu from '../components/common/DashMenu.vue';
import { DashMenuButton, DashMenuNumberSetting } from '../components/common/dash-menu';
import { computed, ref } from 'vue';
import { useNechtoService, useNechtoState, toggleLanguage1 } from '../service';
import Stol from '../components/Stol.vue';
import Hand from '../components/Hand.vue';
import Log from '../components/Log.vue';
import SPECTATORSI from '../components/SPECTATORSI.vue';
import PhoneXd from '../components/phoneXd.vue';
import Plashka from '../components/plashka.vue';

defineProps();

const state = useNechtoState();
const service = useNechtoService();



const bottomButtons = computed<DashMenuButton[]>(() => {
    return [
        {
            icon: 'store',
            onClick: () => {
                service.setRoomMode();
            },
        },
        {
            icon: 'language',
            onClick: () => {
                toggleLanguage1();
            },
        },
        {
            icon: state.value.teamsLocked ? 'lock_outline' : 'lock_open',
            onClick: async () => {
                service.toggleLock();
            },
        },
        {
            icon: 'play_arrow',
            onClick: () => {
                service.startGame();
            },
        },
        {
            icon: 'stop_circle',
            onClick: () => {
                service.abortGame();
            }
        },
        {
            icon: 'person',
            onClick: () => {
                service.startWithNechto();
            }
        },
        {
            icon: 'lock',
            onClick: () => {
                service.toggleLock();
            }
        }
    ];
});

const numberSettings: DashMenuNumberSetting[] = [
    {
        icon: 'wb_sunny',
        originalValue: 1,
        onChange: (v) => {
            console.log('wb_sunny', v);
        },
    },
];

</script>

<style>
body.dark-theme {
    background-color: #161816 !important;
    ;
    color: var(--text-color);
    padding-top: 10px;
    place-items: start;
    background: url(../components/img/phone.png);
    background-size: contain;
    background-repeat: repeat;
}
</style>
