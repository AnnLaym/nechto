<template>
    <div class="fixed bottom-0 right-0 wrap bg-panel p-2 surface-card flex flex-column gap-2 hui">
        <div class="hidden-part">
            <div v-for="(setting, index) of props.numberSettings" :key="index" class="kmopka">
                <InputNumber
                    v-model="settingsValues[index]"
                    :pt="{ input: () => ({ class: ['hui'] }) }"
                    class="p-inputtext-sm"
                    show-buttons
                    input-class="p-2"
                    :min="setting.min"
                    :max="setting.max"
                    @update:model-value="settingChange(index)" />
            </div>
        </div>
        <div class="flex gap-2 justify-content-end">
            <div v-for="(button, index) of props.bottomButtons" :key="index" class="hidden-part flex gap-2">
                <MaterialIcon :icon="button.icon" button @click="button.onClick" />
            </div>
            <MaterialIcon icon="settings" />
        </div>
    </div>
</template>

<script lang="ts" setup>
    import InputNumber from 'primevue/inputnumber'
    import { ref } from 'vue'
    import { DashMenuButton, DashMenuNumberSetting } from './dash-menu'
    import MaterialIcon from './MaterialIcon.vue'

    const props = withDefaults(
        defineProps<{
            bottomButtons?: DashMenuButton[]
            numberSettings?: DashMenuNumberSetting[]
        }>(),
        {
            bottomButtons: () => [],
            numberSettings: () => [],
        },
    )

    const settingsValues = ref(props.numberSettings.map((it) => it.originalValue))

    function settingChange(index: number) {
        props.numberSettings[index].onChange(settingsValues.value[index])
    }
</script>

<style scoped>
    /*.hidden-part {*/
    /*    display: none;*/
    /*}*/

    .wrap:hover .hidden-part {
        display: block;
    }

    .kmopka {
        display: flex;
        gap: 2px;
    }

    .hidden-part {
        flex-flow: row;
    }

    .hui {
        z-index: 200;
    }
</style>
