<template>
    <div class="root">
        <div class="top">
            <div class="top-left"></div>
            <div class="top-mid"></div>
            <div class="top-right"></div>
        </div>
        <div class="mid">
            <div class="center-left"></div>
            <div class="center-right"></div>
        </div>
        <div class="bottom">
            <div class="bottom-left"></div>
            <div class="bottom-right"></div>
        </div>
    </div>
</template>
<script lang="ts" setup>

</script>

<style scoped>
.center-left{
    background-image: url(./img/4.png);
}
.center-right{
    background-image: url(./img/5.png);
    background-position: right;
}
.bottom-left{
    background-image: url(./img/6.png);
    background-position: bottom;
}
.bottom-right{
    background-image: url(./img/7.png);
    background-position: right;
    background-position: bottom;
}
.root {
    position: fixed;
    display: flex;
    flex-flow: column;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

.root>* {
    display: flex;
    flex: 1;
    justify-content: space-between;
}

.root>*>* {
    flex: 1;
    background-size: contain;
    background-repeat: no-repeat;
    max-width: 15%;
}
</style>
