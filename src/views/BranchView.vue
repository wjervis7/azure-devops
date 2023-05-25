<script setup lang="ts">
import BsTable, { type Header } from "@/components/BsTable.vue";
import { azureStore } from "@/stores/azure";
import { get } from "@/utilities/azure";

const store = azureStore();

const setupRequired = (() => {
    const missing = [];
    if (!store.org) {
        missing.push("organization");
    }

    if (!store.pat) {
        missing.push("personal access token");
    }

    if (!store.project) {
        missing.push("project");
    }

    if (!store.repo) {
        missing.push("repository");
    }

    return missing.length ? `The following items need to be set: ${missing.join(",")}.` : null;
})();

const branchApiUrl = `https://dev.azure.com/${store.org}/${store.project}/_apis/git/repositories/${store.repo}/refs?api-version=7.1-preview.1`;

const headers: Header[] = [
    {
        heading: "Branch Name",
        dataProperty: "name"
    },
    {
        heading: "Creator",
        dataProperty: "creator.displayName"
    }
];

const branches = setupRequired ? [] : await get<Azure.Ref[]>(branchApiUrl);

console.log(branches);
</script>

<template>
    <div v-if="setupRequired">
        {{ setupRequired }}
        Go <RouterLink to="/azure">here</RouterLink>, to set these up.
    </div>

    <div v-else>
        <BsTable :headers="headers" :rows="branches"></BsTable>
    </div>
</template>
