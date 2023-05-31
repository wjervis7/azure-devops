<script setup lang="ts">
import { ref, computed, toRefs, onMounted, watch } from "vue";
import Tagify from "@yaireo/tagify";
import "@yaireo/tagify/dist/tagify.css";

interface TagifyValue {
    value: string;
}

const props = defineProps({
    input: {
        type: String,
        required: true
    },
    disabled: Boolean,
    placeholder: {
        type: String,
        required: true
    },
    modelValue: {
        type: [String, Number, Array<string>, Array<number>],
        required: true
    },
    options: {
        type: Array<string>,
        required: true
    },
    single: Boolean
});

// eslint-disable-next-line vue/no-dupe-keys
const { disabled, options } = toRefs(props);
const optionsCopy = options.value;
const t = typeof props.modelValue;

const tabRef = ref(null);

const emit = defineEmits(["update:modelValue"]);
const placeholderText = computed(() => (!options.value.length ? "There are no options to search." : props.placeholder));

const clearValue = () => {
    let val;
    if (t === "number") {
        val = 0;
    } else if (t === "string") {
        val = "";
    } else {
        val = [];
    }
    emit("update:modelValue", val);
};

onMounted(() => {
    const tagOptions: Tagify.TagifySettings = {
        enforceWhitelist: true,
        whitelist: optionsCopy,
        dropdown: {
            maxItems: 20,
            enabled: 0,
            closeOnSelect: props.single
        },
        mode: props.single ? "select" : null
    };
    const tag = new Tagify(tabRef.value!, tagOptions);

    tag.on("change", (e) => {
        if (!e.detail.value) {
            clearValue();
            return;
        }
        const tValue = JSON.parse(e.detail.value) as TagifyValue[];
        const value = props.single ? tValue[0].value : tValue.map((v) => v.value);
        emit("update:modelValue", value);
    });

    watch(options, (newOptions) => {
        tag.whitelist = newOptions;
    });
});
</script>

<template>
    <input class="form-control" :id="input" :placeholder="placeholderText" :value="modelValue" :disabled="disabled" ref="tabRef" />
</template>
