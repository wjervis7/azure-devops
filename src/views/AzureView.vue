<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Tooltip } from "bootstrap";
import { azureStore } from "@/stores/azure";
import { get, requiredScopes } from "@/utilities/azure";
import BsLabel from "@/components/BsLabel.vue";
import BsInput from "@/components/BsInput.vue";
import BsDatalist from "@/components/BsDatalist.vue";
import BsModal from "@/components/BsModal.vue";
import BsModalButton from "@/components/BsModalButton.vue";

const store = azureStore();

const org = ref(store.org);
const pat = ref(store.pat);
const project = ref(store.project);
const repo = ref(store.repo);

const newPatUrl = computed(() => `https://dev.azure.com/${org.value || "{org}"}/_usersSettings/tokens`);
const projectsEndpoint = computed(() => `https://dev.azure.com/${org.value}/_apis/projects?api-version=7.1-preview.4`);
const reposEndpoint = computed(() => `https://dev.azure.com/${org.value}/${project.value}/_apis/git/repositories?api-version=7.1-preview.1`);

const projects = ref<string[]>([]);
const repos = ref<string[]>([]);

const disableProjects = computed(() => !org.value || !pat.value);
const disableRepos = computed(() => !org.value || !pat.value || !project.value || !projects.value.includes(project.value));

const updateProjects = async () => {
    if (!org.value || !pat.value) {
        return;
    }

    const azureProjects = await get<Azure.Project[]>(projectsEndpoint.value, pat.value);
    projects.value = azureProjects.map((p) => p.name);
};

const updateRepos = async () => {
    if (!org.value || !pat.value || !project.value) {
        return;
    }

    const azureRepos = await get<Azure.Repo[]>(reposEndpoint.value, pat.value);
    repos.value = azureRepos.map((r) => r.name);
};

await updateProjects();
await updateRepos();

const clearValues = () => {
    store.clear();
    org.value = "";
    pat.value = "";
    project.value = "";
    repo.value = "";
};
const saveValues = () => {
    store.org = org.value;
    store.pat = pat.value;
    store.project = project.value;
    store.repo = repo.value;
};

const projectReloadRef = ref(null);
const repoReloadRef = ref(null);

onMounted(() => {
    new Tooltip(projectReloadRef.value!);
    new Tooltip(repoReloadRef.value!);
});
</script>

<template>
    <div class="row g-3">
        <h4 class="mb-3">Azure Details</h4>
        <div class="col-12">
            <BsLabel input="org">Organization</BsLabel>
            <BsInput input="org" v-model="org" required>
                <template v-slot:description> Your organization is the part that follows the .com, in your repo url. E.g., for https://dev.azure.com/wjervis/, wjervis is the organization. </template>
                <template v-slot:validation> Organization is required. </template>
            </BsInput>
        </div>
        <div class="col-12">
            <BsLabel input="pat">Personal Access Token</BsLabel>
            <BsInput input="pat" v-model="pat" required>
                <template v-slot:description> Enter your personal access token. Click <BsModalButton target="#pat-help">here </BsModalButton> for help on generating a token. </template>
                <template v-slot:validation> Personal Access Token is required. </template>
            </BsInput>
            <BsModal title="Obtain a Personal Access Token" id="pat-help">
                To generate a personal access token, go to <a target="_blank" :href="newPatUrl">{{ newPatUrl }}</a
                >, and click on <strong>New Token</strong> {{ newPatUrl.indexOf(org) > 0 ? "" : "(Replace {org} with your organization)" }}.
                <br />
                Select the following scopes:
                <ul>
                    <li v-for="(scope, i) in requiredScopes" v-bind:key="i">{{ scope.scope }} ({{ scope.reason }})</li>
                </ul>
            </BsModal>
        </div>
        <div class="col-12">
            <BsLabel input="project">Project</BsLabel>
            <div class="input-group mb-3">
                <BsDatalist input="project" v-model="project" :options="projects" placeholder="Type to search projects" :disabled="disableProjects"></BsDatalist>
                <button
                    type="button"
                    class="btn btn-outline-secondary bi bi-arrow-clockwise"
                    @click="updateProjects"
                    :disabled="disableProjects"
                    ref="projectReloadRef"
                    title="Click to reload projects"
                ></button>
            </div>
        </div>
        <div class="col-1"></div>
        <div class="col-12">
            <BsLabel input="repo">Repository</BsLabel>
            <div class="input-group mb-3">
                <BsDatalist input="repo" v-model="repo" :options="repos" placeholder="Type to search repositories" :disabled="disableRepos"></BsDatalist>
                <button
                    type="button"
                    class="btn btn-outline-secondary bi bi-arrow-clockwise"
                    @click="updateRepos"
                    :disabled="disableRepos"
                    ref="repoReloadRef"
                    title="Click to reload repositories"
                ></button>
            </div>
        </div>
        <div class="col-12">
            <button type="button" class="btn btn-destructive" @click="clearValues">Clear Values</button>
            <button type="button" class="btn btn-primary" @click="saveValues">Save Values</button>
        </div>
    </div>
</template>

<style scoped>
ul {
    list-style-type: none;
}
</style>
