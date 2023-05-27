<script setup lang="ts">
import { toRefs } from "vue";

export interface DropdownItem {
    text?: string;
    click?: string | ((e: Event) => void);
    type?: string;
}

export interface ButtonGroupProps {
    buttonText: string;
    buttonClick?(e: Event): void;
    dropdownItems: DropdownItem[];
    split: boolean;
}

const props = defineProps<ButtonGroupProps>();

// eslint-disable-next-line vue/no-dupe-keys
const { buttonText, buttonClick, dropdownItems, split } = toRefs(props);

const click = (e: Event) => {
    if (buttonClick!.value) {
        buttonClick!.value(e);
    }
};
</script>

<template>
    <div class="btn-group float-end">
        <button
            type="button"
            class="btn btn-secondary btn-sm"
            :class="{ 'dropdown-toggle': !split }"
            :data-bs-toggle="split ? null : 'dropdown'"
            :aria-expanded="split ? undefined : 'false'"
            @click="click"
        >
            {{ buttonText }}
        </button>
        <button v-if="split" type="button" class="btn btn-sm btn-secondary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
            <span class="visually-hidden">Toggle Dropdown</span>
        </button>
        <ul class="dropdown-menu dropdown-menu-dark">
            <li v-for="(dropdownItem, i) in dropdownItems" v-bind:key="i">
                <a v-if="dropdownItem.type === 'link'" class="dropdown-item" :href="(dropdownItem.click as string)">{{ dropdownItem.text }}</a>
                <button v-else-if="dropdownItem.type === 'button'" type="button" class="dropdown-item" @click="dropdownItem.click">{{ dropdownItem.text }}</button>
                <hr v-else class="dropdown-divider" />
            </li>
        </ul>
    </div>
</template>

<style scoped lang="scss">
.btn-sm + .dropdown-menu {
    padding-top: 0;
    padding-bottom: 0;

    & > li > .dropdown-item {
        font-size: 0.875rem;
        padding: 0.25rem 0.5rem;
    }
}
</style>
