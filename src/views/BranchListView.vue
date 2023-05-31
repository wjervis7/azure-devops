<script setup lang="ts">
import router from "@/router";
import { azureStore } from "@/stores/azure";
import azure from "@/utilities/azure";
import BsTable, { type Header } from "@/components/BsTable.vue";

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

const headers: Header[] = [
    {
        heading: "Branch Name",
        linkTo: (row) =>
            router.resolve({
                name: "branch",
                params: {
                    name: (row as Azure.Ref).name.split("/").pop()
                }
            }).fullPath,
        linkText: (row) => (row as Azure.Ref).name
    },
    {
        heading: "Creator",
        dataProperty: "creator.displayName"
    }
];

const branches = setupRequired ? [] : await azure.getBranches();
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
