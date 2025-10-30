<template>
    <div class="button flex align-items-center gap-2">
        <MaterialIcon v-if="icon" :icon="icon" />
        {{ title }}
    </div>
</template>

<script lang="ts" setup>
    import MaterialIcon from './MaterialIcon.vue'

    defineProps<{
        title?: string
        icon?: string
    }>()
</script>

<style scoped>
    .button {
        cursor: pointer;

        &:hover {
            background-color: var(--primary-color);
            color: var(--primary-color-text);
        }
    }
</style>
