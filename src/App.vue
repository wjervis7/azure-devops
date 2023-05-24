<script setup lang="ts">
import { RouterView } from "vue-router";
import NavBar from "./components/NavBar.vue";
import SiteFooter from "./components/SiteFooter.vue";
</script>

<template>
    <header>
        <NavBar />
    </header>

    <main class="flex-shrink-0">
        <div class="container">
            <RouterView />
        </div>
    </main>

    <footer class="footer mt-auto py-3 bg-light">
        <SiteFooter />
    </footer>
</template>
