<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Toast } from "bootstrap";
import { DateTime } from "luxon";

export interface ToastProps {
    id?: string;
    title?: string;
    time: DateTime;
    body?: string;
    animation?: boolean;
    autohide?: boolean;
    delay?: number;
}

const props = withDefaults(defineProps<ToastProps>(), {
    id: crypto.randomUUID(),
    animation: true,
    autohide: true,
    delay: 5000
});

const emit = defineEmits(["close"]);

const toastRef = ref(null);
const relativeTime = ref(props.time.toRelative());

const refreshTime = 10 * 1000;

onMounted(() => {
    const toast = new Toast(toastRef.value!, {
        animation: props.animation,
        autohide: props.autohide,
        delay: props.delay
    });

    (toastRef.value! as Element).addEventListener("hidden.bs.toast", () => {
        emit("close");
    });

    if (!props.autohide) {
        setInterval(() => (relativeTime.value = props.time.toRelative()), refreshTime);
    }

    toast.show();
});
</script>

<template>
    <div ref="toastRef" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
            <strong class="me-auto" v-if="title">{{ title }}</strong>
            <small>{{ relativeTime }}</small>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="close"></button>
        </div>
        <div v-if="body" class="toast-body">
            {{ body }}
        </div>
    </div>
</template>
