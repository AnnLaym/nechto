<template>
    <i class="material-icons icon" :class="{ button }">{{ icon }}</i>
</template>

<script setup lang="ts">
    defineProps<{
        icon: string
        button?: boolean
    }>()
</script>

<style lang="scss">
    .icon {
        user-select: none;
    }

    .button {
        cursor: pointer;

        &:hover {
            background-color: var(--primary-color);
            color: var(--primary-color-text);
        }
    }

    .button-icon {
        width: 24px;
        height: 24px;
        cursor: pointer;
        filter: invert(1);

        &:hover {
            background-color: var(--primary-color);
            color: var(--primary-color-text);
            filter: invert(0);
        }
    }
</style>
