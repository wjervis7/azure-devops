<script setup lang="ts">
defineProps({
    input: {
        type: String,
        required: true
    }
});
</script>

<template>
    <label :for="input" class="form-label">
        <slot></slot>
    </label>
</template>
