<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import { DateTime } from "luxon";
import BsTable, { type Header } from "@/components/BsTable.vue";
import { azureStore } from "@/stores/azure";
import azure from "@/utilities/azure";
import BsLabel from "@/components/BsLabel.vue";
import BsDatalist from "@/components/BsDatalist.vue";
import { type ToastProps } from "@/components/BsToast.vue";
import BsToastsContainer from "@/components/BsToastsContainer.vue";
import type { ButtonGroupProps } from "@/components/BsButtonGroup.vue";
import BsButtonGroup from "@/components/BsButtonGroup.vue";

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
        heading: "PR Name",
        dataProperty: "title"
    },
    {
        heading: "Date Completed",
        formatFunc: (row) => DateTime.fromISO((row as Azure.PullRequest).closedDate).toLocaleString(DateTime.DATETIME_SHORT)
    },
    {
        heading: "Author",
        dataProperty: "createdBy.displayName"
    },
    {
        heading: "Target",
        formatFunc: (row) => (row as Azure.PullRequest).targetRefName.split("/").pop() as string
    },
    {
        heading: "Merge Commit",
        formatFunc: (row) => ((row as Azure.PullRequest).lastMergeCommit ? row.lastMergeCommit.commitId : "")
    },
    {
        heading: "Tags",
        formatFunc: (row) => {
            if (!row.labels) {
                return "";
            }
            return (row as Azure.PullRequest).labels
                .map((l) => l.name)
                .flat()
                .distinct()
                .join(", ");
        }
    }
];

const branches = ref<Azure.PullRequest[]>([]);
const tags = ref<string[]>([]);
const tagList = ref<string[]>([]);

const azureBranches = (setupRequired ? [] : await azure.getPullRequests()).sort((a, b) => (a.closedDate > b.closedDate ? -1 : 1));
branches.value = azureBranches;
tagList.value = azureBranches
    .filter((pr) => pr.labels)
    .map((pr) => pr.labels)
    .flat()
    .map((l) => l.name)
    .distinct();

let timeOut: number;
watch(tags, (newTags) => {
    if (timeOut) {
        clearTimeout(timeOut);
    }

    timeOut = window.setTimeout(async () => {
        branches.value = !newTags.length ? azureBranches : azureBranches.filter((pr) => pr.labels && pr.labels.map((l) => l.name).intersect(newTags).length);
        await nextTick();
    }, 500);
});

const toasts = ref<ToastProps[]>([]);

const copyCommits = (asGitCommand = false) => {
    const commits = branches.value.map((pr) => pr.lastMergeCommit).map((c) => c.commitId);
    let copyText = "";
    if (asGitCommand) {
        copyText = `git cherry-pick -n ${commits.join(" ")}`;
    } else {
        copyText = commits.join("\r\n");
    }
    navigator.clipboard.writeText(copyText);
    toasts.value.push({
        autohide: false,
        title: "Copied!",
        time: DateTime.now()
    });
};

const buttonGroup: ButtonGroupProps = {
    buttonText: "Copy Commits",
    buttonClick: () => copyCommits(),
    dropdownItems: [
        {
            type: "button",
            text: "Copy Commits as Cherry Pick Command",
            click: () => copyCommits(true)
        }
    ],
    split: true
};
</script>

<template>
    <div v-if="setupRequired">
        {{ setupRequired }}
        Go <RouterLink to="/azure">here</RouterLink>, to set these up.
    </div>

    <div v-else>
        <div class="row">
            <BsLabel input="tag" class="col-form-label col-1 offset-6">Tag</BsLabel>
            <div class="col-5">
                <BsDatalist input="tag" v-model="tags" :options="tagList" placeholder="Type to search tags"></BsDatalist>
            </div>
        </div>
        <BsButtonGroup class="mt-3" v-bind="buttonGroup"></BsButtonGroup>
        <BsTable :headers="headers" :rows="branches"></BsTable>
        <BsToastsContainer :toasts="toasts"></BsToastsContainer>
    </div>
</template>
