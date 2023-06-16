<script setup lang="ts">
import { modalStore } from "@/stores/modal";

const store = modalStore();

const props = defineProps({
    target: {
        type: String,
        required: true
    }
});

const emits = defineEmits<{
    click: [() => void];
}>();

const openModal = () => {
    emits("click", () => {
        const modal = store.getModal(props.target);

        modal.show();
    });
};
</script>

<template>
    <button type="button" class="btn btn-link p-0" @click="openModal">
        <slot></slot>
    </button>
</template>
