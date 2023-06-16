<script setup lang="ts">
defineProps<{
    heading?: string;
    value?: string | number | boolean;
}>();
</script>

<template>
    <dt class="col-3">
        <slot name="heading">{{ heading }}</slot>
    </dt>
    <dd class="col-9">
        <slot name="value">{{ value }}</slot>
    </dd>
</template>
