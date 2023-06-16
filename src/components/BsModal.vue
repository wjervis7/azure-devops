<script setup lang="ts">
import { modalStore } from "@/stores/modal";
import { onMounted, ref, useSlots } from "vue";

export interface Props {
    id?: string;
    title: string;
    backdrop?: boolean | "static";
    focus?: boolean;
    keyboard?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    id: crypto.randomUUID(),
    backdrop: true,
    focus: true,
    keyboard: true
});

const emits = defineEmits(["bs:hide", "bs:hidden", "bs:hidePrevented", "bs:show", "bs:shown"]);

const slots = useSlots();

const store = modalStore();
const modalEl = ref<HTMLElement | null>(null);

onMounted(() => {
    if (!store.hasModal(props.id)) {
        store.createModal(props.id, {
            backdrop: props.backdrop,
            focus: props.focus,
            keyboard: props.keyboard
        });
    }

    modalEl.value!.addEventListener("hide.bs.modal", (e) => emits("bs:hide", e));
    modalEl.value!.addEventListener("hidden.bs.modal", (e) => emits("bs:hidden", e));
    modalEl.value!.addEventListener("hidePrevented.bs.modal", (e) => emits("bs:hidePrevented", e));
    modalEl.value!.addEventListener("show.bs.modal", (e) => emits("bs:show", e));
    modalEl.value!.addEventListener("shown.bs.modal", (e) => emits("bs:shown", e));
});
</script>

<template>
    <div ref="modalEl" class="modal" tabindex="-1" :id="id">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5">{{ title }}</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <slot></slot>
                </div>
                <div v-if="slots.footer" class="modal-footer">
                    <slot name="footer"></slot>
                </div>
            </div>
        </div>
    </div>
</template>
