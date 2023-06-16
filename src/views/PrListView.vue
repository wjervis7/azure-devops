<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import router from "@/router";
import { DateTime } from "luxon";
import { azureStore } from "@/stores/azure";
import azure from "@/utilities/azure";
import git from "@/utilities/git";
import { displayDate } from "@/utilities/dateTime";
import type { Azure } from "@/types/azure";
import BsTable, { type Header } from "@/components/BsTable.vue";
import BsLabel from "@/components/BsLabel.vue";
import BsDatalist from "@/components/BsDatalist.vue";
import { type ToastProps } from "@/components/BsToast.vue";
import BsToastsContainer from "@/components/BsToastsContainer.vue";
import type { ButtonGroupProps } from "@/components/BsButtonGroup.vue";
import BsButtonGroup from "@/components/BsButtonGroup.vue";

const store = azureStore();

const setupRequired = store.setupRequired();

const headers: Header[] = [
    {
        heading: "PR Name",
        linkText: (row) => (row as Azure.PullRequest.PullRequest).title,
        linkTo: (row) =>
            router.resolve({
                name: "pullrequest",
                params: {
                    id: (row as Azure.PullRequest.PullRequest).pullRequestId
                }
            }).fullPath
    },
    {
        heading: "Date Completed",
        formatFunc: (row) => displayDate((row as Azure.PullRequest.PullRequest).closedDate)
    },
    {
        heading: "Author",
        dataProperty: "createdBy.displayName"
    },
    {
        heading: "Target",
        formatFunc: (row) => (row as Azure.PullRequest.PullRequest).targetRefName.split("/").pop() as string
    },
    {
        heading: "Merge Commit",
        formatFunc: (row) => ((row as Azure.PullRequest.PullRequest).lastMergeCommit ? row.lastMergeCommit.commitId : "")
    },
    {
        heading: "Tags",
        formatFunc: (row) => {
            if (!row.labels) {
                return "";
            }
            return (row as Azure.PullRequest.PullRequest).labels
                .map((l) => l.name)
                .flat()
                .distinct()
                .join(", ");
        }
    }
];

const pullRequests = ref<Azure.PullRequest.PullRequest[]>([]);
const tags = ref<string[]>([]);
const tagList = ref<string[]>([]);

const azurePullRequests = (setupRequired ? [] : await azure.getPullRequests()).sort((a, b) => (a.closedDate > b.closedDate ? -1 : 1));
pullRequests.value = azurePullRequests;
tagList.value = azure.getTagsFromObject(azurePullRequests);

let timeOut: number;
watch(tags, (newTags) => {
    if (timeOut) {
        clearTimeout(timeOut);
    }

    timeOut = window.setTimeout(async () => {
        pullRequests.value = !newTags.length ? azurePullRequests : azurePullRequests.filter((pr) => pr.labels && pr.labels.map((l) => l.name).intersect(newTags).length);
        await nextTick();
    }, 500);
});

const toasts = ref<ToastProps[]>([]);

const copyCommits = (asGitCommand = false) => {
    if (asGitCommand) {
        git.copyCherryPickCommits(pullRequests.value.map((pr) => pr.lastMergeCommit));
    } else {
        git.copyCommitIds(pullRequests.value.map((pr) => pr.lastMergeCommit));
    }
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
        <BsTable :headers="headers" :rows="pullRequests"></BsTable>
        <BsToastsContainer :toasts="toasts"></BsToastsContainer>
    </div>
</template>
