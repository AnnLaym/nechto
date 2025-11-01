<template>
    <div v-if="state.inited" class="bigMain">
        <PhoneXd />
        <Plashka />
        <SPECTATORSI />
        <Stol />
        <Pravii_corner />
        <Hand />
        <DashMenu :bottom-buttons="bottomButtons" :number-settings="numberSettings" />
        <div v-if="hoveredTimer" class="timer-popup">
            <div class="timer-inputs">
                <i class="material-icons timer-icon">timer</i>
                <input v-model.number="localSmallTimer" type="number" min="5" max="99" />
                <i class="material-icons timer-icon">hourglass_full</i>
                <input v-model.number="localBigTimer" type="number" min="10" max="99" />
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
    import { computed, ref, watch } from 'vue'
    import { DashMenuButton, DashMenuNumberSetting } from '../components/common/dash-menu'
    import DashMenu from '../components/common/DashMenu.vue'
    import Hand from '../components/Hand.vue'
    import PhoneXd from '../components/phoneXd.vue'
    import Plashka from '../components/plashka.vue'
    import Pravii_corner from '../components/pravii_corner.vue'
    import SPECTATORSI from '../components/SPECTATORSI.vue'
    import Stol from '../components/Stol.vue'
    import { offnutZvuk, offZvuk, toggleLanguage1, useNechtoService, useNechtoState } from '../service'

    defineProps()

    const state = useNechtoState()
    const service = useNechtoService()

    const hoveredTimer = ref(false)
    const localSmallTimer = ref(state.value.smallTimer)
    const localBigTimer = ref(state.value.bigTimer)
    watch(hoveredTimer, (val) => {
        if (val) {
            localSmallTimer.value = state.value.smallTimer
            localBigTimer.value = state.value.bigTimer
        }
    })
    watch(
        () => [state.value.smallTimer, state.value.bigTimer],
        ([s, b]) => {
            if (!hoveredTimer.value) return
            localSmallTimer.value = s
            localBigTimer.value = b
        },
    )

    const bottomButtons = computed<DashMenuButton[]>(() => {
        return [
            {
                icon: 'store',
                onClick: () => {
                    service.setRoomMode()
                },
            },
            {
                icon: 'language',
                onClick: () => {
                    toggleLanguage1()
                },
            },
            {
                icon: state.value.teamsLocked ? 'lock_outline' : 'lock_open',
                onClick: async () => {
                    service.toggleLock()
                },
            },
            {
                icon: 'play_arrow',
                onClick: () => {
                    service.startGame()
                },
            },
            {
                icon: 'stop_circle',
                onClick: () => {
                    service.abortGame()
                },
            },
            {
                icon: 'person', // TODO: добавить иконку и оповещение хоста о том, что будет игра с нечто/без нечто
                onClick: () => {
                    service.startWithNechto()
                },
            },
            {
                icon: offZvuk ? 'volume_up' : 'volume_off', // TODO: не работает
                onClick: () => {
                    offnutZvuk()
                },
            },
            {
                icon: 'shuffle',
                onClick: () => {
                    service.shufflePlayers()
                },
            },
            {
                icon: 'pause_circle_filled',
                onClick: () => {
                    service.pauseGame()
                },
            },
            {
                icon: 'timer',
                onClick: () => {
                    if (hoveredTimer.value) {
                        updateTimer()
                    } else {
                        localSmallTimer.value = state.value.smallTimer
                        localBigTimer.value = state.value.bigTimer
                    }
                    hoveredTimer.value = !hoveredTimer.value
                },
            },
        ]
    })

    const numberSettings: DashMenuNumberSetting[] = [
        // {
        //     icon: 'wb_sunny',
        //     originalValue: 1,
        //     onChange: (v) => {
        //         console.log('wb_sunny', v);
        //     },
        // },
    ]

    function updateTimer() {
        const smallTimer = Math.max(5, Math.min(localSmallTimer.value, 99))
        const bigTimer = Math.max(10, Math.min(localBigTimer.value, 99))
        service.setTimer(smallTimer, bigTimer)
    }
</script>

<style>
    body.dark-theme {
        background-color: #161816 !important;
        color: var(--text-color);
        padding-top: 10px;
        place-items: start;
        background: url(../components/img/phone.png);
        background-size: contain;
        background-repeat: repeat;
    }

    .bigMain {
        display: flex;
        flex-flow: column;
        justify-content: space-between;
    }

    .timer-popup {
        background-color: #161816 !important;
        position: fixed;
        bottom: 48px;
        right: 0;
        padding: 10px 12px;
        z-index: 290;
    }

    .timer-inputs {
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .timer-icon {
        width: 24px;
        height: 24px;
    }

    @media screen and (max-width: 900px) {
        .bigMain {
            height: 100vh;
            overflow: hidden;
        }
    }
</style>
