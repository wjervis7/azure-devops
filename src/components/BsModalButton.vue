<script setup lang="ts">
import { Modal } from "bootstrap";

const props = defineProps({
    target: {
        type: String,
        required: true
    }
});

let modal: Modal | null = null;

const openModal = () => {
    if (!modal) {
        modal = new Modal(props.target);
    }

    modal.show();
};
</script>

<template>
    <button type="button" class="btn btn-link p-0" @click="openModal">
        <slot></slot>
    </button>
</template>
