<template>
    <div v-if="state.inited" class="bigMain">
        <PhoneXd />
        <Plashka />
        <SPECTATORSI />
        <Stol />
        <Pravii_corner />
        <Hand />
        <DashMenu :bottom-buttons="bottomButtons" :number-settings="numberSettings" />
        <div v-if="showTimerPopup" class="timer-popup">
            <div class="timer-inputs">
                <i class="material-icons timer-icon">timer</i>
                <input :value="localSmallTimer" type="number" min="5" max="99" @input="onSmallTimerChange($event.target.value)" />
                <i class="material-icons timer-icon">hourglass_full</i>
                <input :value="localBigTimer" type="number" min="10" max="99" @input="onBigTimerChange($event.target.value)" />
            </div>
        </div>
        <div v-if="promoMenu" class="promo-popup">
            <div class="promo-list">
                <button class="card-btn" :class="{ active: promo.lovecraft }" :title="getActionLog('players', 6)" @click="togglePromoCard('lovecraft')">
                    {{ getCardName('lovecraft') }}
                </button>
                <button class="card-btn" :class="{ active: promo.necronomicon }" :title="getActionLog('players', 10)" @click="togglePromoCard('necronomicon')">
                    {{ getCardName('necronomicon') }}
                </button>
                <button class="card-btn" :class="{ active: promo.dynamite }" :title="getActionLog('players', 8)" @click="togglePromoCard('dynamite')">
                    {{ getCardName('dynamite') }}
                </button>
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
    import { getActionLog, getCardName } from '../log'
    import { offnutZvuk, offZvuk, toggleLanguage1, useNechtoService, useNechtoState } from '../service'

    defineProps()

    const state = useNechtoState()
    const service = useNechtoService()

    const showTimerPopup = ref(false)
    const localSmallTimer = ref(state.value.smallTimer)
    const localBigTimer = ref(state.value.bigTimer)
    watch(
        () => [state.value.smallTimer, state.value.bigTimer],
        ([s, b]) => {
            if (!showTimerPopup.value) return
            localSmallTimer.value = s
            localBigTimer.value = b
        },
    )

    const bottomButtons = computed<DashMenuButton[]>(() => {
        return [
            {
                icon: 'store',
                onClick: () => {
                    closePopups()
                    service.setRoomMode()
                },
            },
            {
                icon: 'language',
                onClick: () => {
                    closePopups()
                    toggleLanguage1()
                },
            },
            {
                icon: state.value.teamsLocked ? 'lock_outline' : 'lock_open',
                onClick: async () => {
                    closePopups()
                    service.toggleLock()
                },
            },
            {
                icon: 'play_arrow',
                onClick: () => {
                    closePopups()
                    service.startGame()
                },
            },
            {
                icon: 'stop_circle',
                onClick: () => {
                    closePopups()
                    service.abortGame()
                },
            },
            {
                icon: state.value.startWithNechto ? '/nechto/icons/nechto_home.svg' : '/nechto/icons/nechto_home_off.svg',
                onClick: () => {
                    closePopups()
                    service.startWithNechto()
                },
            },
            {
                icon: offZvuk.value ? 'volume_off' : 'volume_up',
                onClick: () => {
                    closePopups()
                    offnutZvuk()
                },
            },
            {
                icon: 'shuffle',
                onClick: () => {
                    closePopups()
                    service.shufflePlayers()
                },
            },
            {
                icon: 'pause_circle_filled',
                onClick: () => {
                    closePopups()
                    service.pauseGame()
                },
            },
            {
                icon: 'timer',
                onClick: () => {
                    closePopups('timer')
                    showTimerPopup.value = !showTimerPopup.value
                },
            },
            {
                icon: 'library_add',
                onClick: () => {
                    closePopups('promo')
                    promoMenu.value = !promoMenu.value
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

    function onSmallTimerChange(val: number) {
        if (state.value.userId === state.value.hostId) {
            const small = Math.max(5, Math.min(Number(val), 69))
            service.setTimer(small, state.value.bigTimer)
        }
    }

    function onBigTimerChange(val: number) {
        if (state.value.userId === state.value.hostId) {
            const big = Math.max(10, Math.min(Number(val), 99))
            service.setTimer(state.value.smallTimer, big)
        }
    }

    const promo = computed(() => state.value.promo)
    const promoMenu = ref(false)

    function togglePromoCard(key: 'lovecraft' | 'necronomicon' | 'dynamite') {
        if (state.value.phase === 0 && state.value.hostId === state.value.userId) {
            state.value.promo[key] = !state.value.promo[key]
            service.setPromo(state.value.promo.lovecraft, state.value.promo.necronomicon, state.value.promo.dynamite)
        }
    }

    function closePopups(current?: 'timer' | 'promo') {
        if (current !== 'timer') showTimerPopup.value = false
        if (current !== 'promo') promoMenu.value = false
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

    .promo-popup {
        background-color: #161816 !important;
        position: fixed;
        bottom: 48px;
        right: 0;
        padding: 10px;
        z-index: 290;
    }

    .promo-list {
        display: flex;
        gap: 8px;
    }

    .card-btn {
        padding: 6px 10px;
        border-radius: 6px;
    }

    .card-btn.active {
        background-color: var(--primary-color);
        color: var(--primary-color-text);
    }

    .card-btn:focus {
        outline: none;
    }

    @media screen and (max-width: 900px) {
        .bigMain {
            height: 100vh;
            overflow: hidden;
        }
    }
</style>
