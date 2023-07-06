<template>
    <div class="fixed bottom-0 right-0 wrap bg-panel p-2 surface-card flex flex-column gap-2">
        <div class="hidden-part">
            <slot />
        </div>
        <div class="flex gap-2 justify-content-end">
            <div v-for="(button, index) of props.bottomButtons" :key="index"
                 class="hidden-part flex gap-2">
                <MaterialIcon :icon="button.icon" @click="button.onClick" button />
            </div>
            <MaterialIcon icon="settings" />
        </div>
    </div>
</template>

<script lang="ts" setup>
    import MaterialIcon from './MaterialIcon.vue';
    import InputNumber from 'primevue/inputnumber';
    import { ref } from 'vue';
    import { DashMenuButton, DashMenuNumberSetting } from './dash-menu';

    const props = withDefaults(defineProps<{
        bottomButtons?: DashMenuButton[],
        numberSettings?: DashMenuNumberSetting[],
    }>(), {
        bottomButtons: () => [],
        numberSettings: () => [],
    });

    const settingsValues = ref(props.numberSettings.map((it) => it.originalValue));

    function settingChange(index: number) {
        props.numberSettings[index].onChange(settingsValues.value[index]);
    }

</script>

<style scoped>
    /*.hidden-part {*/
    /*    display: none;*/
    /*}*/

    .wrap:hover .hidden-part {
        display: block;
    }
</style>
