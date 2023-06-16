import { ref } from "vue";
import { defineStore } from "pinia";
import { Modal } from "bootstrap";

export const modalStore = defineStore("modal", () => {
    const defaultOpts: Modal.Options = {
        backdrop: true,
        focus: true,
        keyboard: true
    };

    const modals = ref<{
        [key: string]: Modal;
    }>({});

    const hasModal = (id: string) => Object.keys(modals.value).includes(id);

    const createModal = (id: string, modalOpts: Modal.Options = defaultOpts) => {
        modals.value[id] = new Modal(`#${id}`, modalOpts);
    };

    const getModal = (id: string, create: boolean = false, modalOpts: Modal.Options = defaultOpts) => {
        if (create && !hasModal(id)) {
            createModal(id, modalOpts);
        }
        return modals.value[id];
    };

    return {
        modals,
        hasModal,
        createModal,
        getModal
    };
});
