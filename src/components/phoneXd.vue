<template>
    <div class="root">
        <div class="top" :style="{ backgroundSize: `${ugolockSize}px auto` }">
            <div ref="ugolock" class="top-left" />
            <div class="top-right" />
        </div>
        <div class="mid">
            <div class="center-left" />
            <div class="center-right" />
        </div>
        <div class="bottom">
            <div class="bottom-left" />
            <div class="bottom-right" />
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { ref } from 'vue'

    const ugolock = ref<HTMLElement>()
    const ugolockSize = ref(ugolock.value?.clientWidth)
</script>

<style scoped>
    .top {
        display: flex;
        justify-content: space-between;
        flex-basis: 100px !important;
        background-image: url(./img/2.png);
        background-repeat: repeat-x !important;
        max-width: 100% !important;
    }

    .top-left {
        background-image: url(./img/1.png);
    }

    .top-right {
        background-image: url(./img/3.png);
        background-position: right;
        background-position: top;
    }

    .center-left {
        background-image: url(./img/4.png);
    }

    .center-right {
        background-image: url(./img/5.png);
        background-position: right;
    }

    .bottom-left {
        background-image: url(./img/6.png);
        background-position: bottom;
        background-position: left;
    }

    .bottom-right {
        background-image: url(./img/7.png);
        background-position: bottom;
        background-position: right;
    }

    .root {
        position: fixed;
        display: flex;
        flex-flow: column;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 0;
    }

    .root > * {
        display: flex;
        flex: 1;
        justify-content: space-between;
    }

    .root > * > * {
        flex: 1;
        background-size: contain;
        background-repeat: no-repeat;
        max-width: 15%;
    }
</style>
