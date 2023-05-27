<script setup lang="ts">
import { RouterLink } from "vue-router";

interface RouterLinks {
    to: string;
    text: string;
}

const routerLinks: RouterLinks[] = [
    {
        to: "/azure",
        text: "Azure"
    },
    {
        to: "/branches",
        text: "Branches"
    },
    {
        to: "/pullrequests",
        text: "Pull Requests"
    }
];
</script>

<template>
    <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
        <div class="container-fluid">
            <RouterLink to="/" class="navbar-brand">DevOps Helper</RouterLink>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div id="navbarCollapse" class="collapse navbar-collapse">
                <ul class="navbar-nav me-auto mb-2 mb-md-0">
                    <li class="nav-item" v-for="routerLink in routerLinks" v-bind:key="routerLink.to">
                        <RouterLink :to="routerLink.to" class="nav-link" aria-current="page">{{ routerLink.text }} </RouterLink>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>
