<script setup lang="ts">
import { nextTick, ref, watch } from "vue";
import { DateTime } from "luxon";
import { azureStore } from "@/stores/azure";
import azure, { urls } from "@/utilities/azure";
import git from "@/utilities/git";
import type { Azure } from "@/types/azure";
import BsTable, { type Header } from "@/components/BsTable.vue";
import BsLabel from "@/components/BsLabel.vue";
import BsDatalist from "@/components/BsDatalist.vue";
import { type ToastProps } from "@/components/BsToast.vue";
import BsToastsContainer from "@/components/BsToastsContainer.vue";
import type { ButtonGroupProps } from "@/components/BsButtonGroup.vue";
import BsButtonGroup from "@/components/BsButtonGroup.vue";

const props = defineProps<{
    name: string;
}>();

const store = azureStore();
const setupRequired = store.setupRequired();

const branch = await azure.getBranch(props.name);
const azurePullRequests = (await azure.getPullRequestsByTarget(branch!.name)).sort((a, b) => (a.closedDate > b.closedDate ? -1 : 1));

const pullRequests = ref<Azure.PullRequest.PullRequest[]>([]);
const tagList = ref<string[]>([]);

const tag = ref<string>("");

const headers: Header[] = [
    {
        heading: "PR Name",
        linkText: (row) => (row as Azure.PullRequest.PullRequest).title,
        linkTo: (row) =>
            urls.pullRequest.formatUnicorn({
                org: store.org,
                project: store.project,
                repo: store.repo,
                id: (row as Azure.PullRequest.PullRequest).pullRequestId
            }),
        linkTarget: "_blank"
    },
    {
        heading: "Date Completed",
        formatFunc: (row) => DateTime.fromISO((row as Azure.PullRequest.PullRequest).closedDate).toLocaleString(DateTime.DATETIME_SHORT)
    },
    {
        heading: "Author",
        dataProperty: "createdBy.displayName"
    },
    {
        heading: "Merge Commit",
        dataProperty: "lastMergeCommit.commitId"
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

pullRequests.value = azurePullRequests;
tagList.value = azure.getTagsFromObject(azurePullRequests);

let timeOut: number;
watch(tag, (newTag) => {
    if (timeOut) {
        clearTimeout(timeOut);
    }

    timeOut = window.setTimeout(async () => {
        pullRequests.value = !newTag ? azurePullRequests : azurePullRequests.filter((pr) => pr.labels && pr.labels.map((l) => l.name).includes(tag.value));
        await nextTick();
    }, 1000);
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
    <template v-else-if="branch">
        <h3>Branch {{ branch.name.replace("/refs/heads/", "") }}</h3>
        <span>Created by {{ branch.creator.displayName }}</span>
        <div class="row mb-3">
            <BsLabel input="tag" class="col-form-label col-1 offset-8">Tag</BsLabel>
            <div class="col-3">
                <BsDatalist input="tag" v-model="tag" :options="tagList" placeholder="Type to search tags"></BsDatalist>
            </div>
        </div>
        <BsButtonGroup v-bind="buttonGroup"></BsButtonGroup>
        <BsTable :headers="headers" :rows="pullRequests"></BsTable>
        <BsToastsContainer :toasts="toasts"></BsToastsContainer>
    </template>
    <div v-else>Unable to get branch details :(</div>
</template>
