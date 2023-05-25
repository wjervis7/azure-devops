<script setup lang="ts">
export interface Props {
    id?: string;
    title: string;
}

withDefaults(defineProps<Props>(), {
    id: crypto.randomUUID()
});
</script>

<template>
    <div class="modal" tabindex="-1" :id="id">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5">{{ title }}</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <slot></slot>
                </div>
            </div>
        </div>
    </div>
</template>
