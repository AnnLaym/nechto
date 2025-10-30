<template>
    <Nechto />
</template>

<script setup lang="ts">
    import Nechto from './views/Nechto.vue'
</script>

<style>
    @import './style/prime.scss';
    @import './style/common.scss';
    @import './style/nechto.css';

    .room-menu {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;
        display: flex;
    }

    .popup_modals {
        z-index: 1001 !important;
    }

    .modal_backdrop {
        z-index: 1000 !important;
    }

    .room-mode-dialog {
        z-index: 1005;
    }
</style>
