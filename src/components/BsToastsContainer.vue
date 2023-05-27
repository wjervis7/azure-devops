<script setup lang="ts">
import BsToast, { type ToastProps } from "@/components/BsToast.vue";

defineProps<{
    toasts: ToastProps[];
}>();
</script>

<template>
    <div class="toast-container top-0 end-0">
        <BsToast v-for="toast in toasts" v-bind="toast" v-bind:key="toast.id"></BsToast>
    </div>
</template>

<style scoped>
.toast-container {
    margin-top: 65px;
}
</style>
