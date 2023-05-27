<script setup lang="ts">
import azure from "@/utilities/azure";

const props = defineProps<{
    name: string;
}>();

const branch = await azure.getBranch(props.name);
</script>

<template>
    <div v-if="branch">{{ branch.name }} - {{ branch.statuses }} - {{ branch.creator.displayName }}</div>
    <div v-else>Unable to get branch details :(</div>
</template>
