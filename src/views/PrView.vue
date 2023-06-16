<script setup lang="ts">
import "core-js/proposals/array-grouping-stage-3-2";
import { ref } from "vue";
import { StoreValues, azureStore } from "@/stores/azure";
import azure from "@/utilities/azure";
import { displayDate } from "@/utilities/dateTime";
import { Azure } from "@/types/azure";
import BsDlItem from "@/components/BsDlItem.vue";
import BsModal from "@/components/BsModal.vue";
import BsModalButton from "@/components/BsModalButton.vue";
import BsLabel from "@/components/BsLabel.vue";
import BsDatalist from "@/components/BsDatalist.vue";
import BsInput from "@/components/BsInput.vue";

const props = defineProps<{
    id: string;
}>();

const store = azureStore();
const setupRequired = store.setupRequired(StoreValues.org | StoreValues.project | StoreValues.pat);

const pullRequest = ref<Azure.PullRequest.PullRequest>();
const pullRequestStatuses = ref<Azure.PullRequestStatus[]>([]);
const statuses = ref<GroupMap<Azure.PullRequestStatus>>();
const selectedStatus = ref<Azure.PullRequestStatus>();
const newStatus = ref<Azure.Git.State>(Azure.Git.State.notSet);
const description = ref<string>("");
const statusOptions = Object.keys(Azure.Git.State).filter((s) => !Number.isNumber(s));

const groupStatuses = () => {
    statuses.value = pullRequestStatuses.value.group(({ context: { genre } }) => genre);

    for (const value of Object.values(statuses.value)) {
        value.splice(0, value.length - 1);
    }
};

if (!setupRequired) {
    const results = await Promise.all([azure.getPullRequest(+props.id), azure.listPullRequestStatuses(+props.id)]);
    pullRequest.value = results[0];
    pullRequestStatuses.value = results[1];

    groupStatuses();
}

const openModal = (status: Azure.PullRequestStatus, cb: () => void) => {
    selectedStatus.value = status;
    newStatus.value = status.state;
    cb();
};

const updateStatus = async () => {
    const newPrStatus = new Azure.PullRequestStatus({
        context: selectedStatus.value!.context,
        state: newStatus.value,
        description: description.value
    });

    const updateStatus = await azure.setPullRequestStatus(+props.id, newPrStatus);

    pullRequestStatuses.value.push(updateStatus);

    groupStatuses();
};
</script>

<template>
    <div v-if="setupRequired">
        {{ setupRequired }}
        Go <RouterLink to="/azure">here</RouterLink>, to set these up.
    </div>
    <div v-else-if="pullRequest">
        <h3>{{ pullRequest.title }}</h3>
        <dl class="row">
            <BsDlItem heading="Status" :value="pullRequest.status"></BsDlItem>
            <BsDlItem heading="Created By" :value="pullRequest.createdBy.displayName"></BsDlItem>
            <BsDlItem heading="Date Created" :value="displayDate(pullRequest.creationDate)"></BsDlItem>
            <BsDlItem v-if="pullRequest?.closedBy" heading="Completed By" :value="pullRequest.closedBy.displayName"></BsDlItem>
            <BsDlItem v-if="pullRequest?.closedDate" heading="Date Completed" :value="displayDate(pullRequest.closedDate)"></BsDlItem>
            <BsDlItem v-if="pullRequest?.lastMergeCommit" heading="Merge Commit" :value="pullRequest.lastMergeCommit.commitId"></BsDlItem>
            <BsDlItem heading="Source Branch" :value="pullRequest.sourceRefName"></BsDlItem>
            <BsDlItem heading="Target Branch" :value="pullRequest.targetRefName"></BsDlItem>
            <BsDlItem heading="Labels">
                <template v-slot:value>
                    <ul class="list-unstyled">
                        <li v-for="label in pullRequest?.labels" v-bind:key="label.id">{{ label.name }}</li>
                    </ul>
                </template>
            </BsDlItem>
            <BsDlItem heading="Statuses">
                <template v-slot:value>
                    <ul class="list-unstyled">
                        <li v-for="(genreStatuses, genre) in statuses" v-bind:key="genre">
                            <strong>{{ genre }}/{{ genreStatuses[0].context.name }}</strong>
                            {{ genreStatuses[0].description ? `- ${genreStatuses[0].description}` : "" }}
                            - {{ genreStatuses[0].state }}
                            <BsModalButton @click="(cb) => openModal(genreStatuses[0], cb)" target="mdlUpdateStatus">Update Status</BsModalButton>
                        </li>
                    </ul>
                </template>
            </BsDlItem>
        </dl>

        <BsModal id="mdlUpdateStatus" :title="`Update ${selectedStatus?.title} Status`">
            <template #default>
                <div class="row mb-3">
                    <BsLabel input="txtNewStatus" class="col-3">Select Status</BsLabel>
                    <div class="col-9">
                        <BsDatalist single v-model="newStatus" placeholder="Search for Status" input="txtNewStatus" :options="statusOptions"></BsDatalist>
                    </div>
                </div>
                <div class="row mb-3">
                    <BsLabel input="txtDescription" class="col-3">Reason</BsLabel>
                    <div class="col-9">
                        <BsInput input="txtDescription" v-model="description"></BsInput>
                    </div>
                </div>
            </template>
            <template #footer>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" @click="updateStatus">Update Status</button>
            </template>
        </BsModal>
    </div>
</template>
