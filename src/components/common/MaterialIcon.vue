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
</style>
