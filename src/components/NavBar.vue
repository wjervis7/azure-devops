<script setup lang="ts">
import { RouterLink } from "vue-router";
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
                    <li class="nav-item">
                        <RouterLink to="/about" class="nav-link" aria-current="page">About</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink to="/azure" class="nav-link" aria-current="page">Azure</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink to="/branches" class="nav-link" aria-current="page">Branches</RouterLink>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>
