<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";
import { azureStore } from "@/stores/azure";

const azure = azureStore();

const pat = ref(azure.pat);

const savePat = () => {
    azure.setPat(pat.value);
}
</script>

<template>
    <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
        <div class="container-fluid">
            <RouterLink to="/" class="navbar-brand">DevOps Helper</RouterLink>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse"
                aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div id="navbarCollapse" class="collapse navbar-collapse">
                <ul class="navbar-nav me-auto mb-2 mb-md-0">
                    <li class="nav-item">
                        <RouterLink to="/about" class="nav-link" aria-current="page">About</RouterLink>
                    </li>
                </ul>
                <form class="d-flex" role="textbox">
                    <input class="form-control me-2" type="text" placeholder="Azure Personal Access Token" v-model="pat" />
                    <button class="btn btn-outline-success" type="button" @click="savePat">Save PAT</button>
                </form>
            </div>
        </div>
    </nav>
</template>