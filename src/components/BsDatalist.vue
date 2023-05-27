<script setup lang="ts">
import { computed, toRefs } from "vue";

const props = defineProps({
    input: {
        type: String,
        required: true
    },
    required: Boolean,
    disabled: Boolean,
    placeholder: {
        type: String,
        required: true
    },
    modelValue: {
        type: [String, Number],
        required: true
    },
    options: {
        type: Array<string | number>,
        required: true
    }
});

// eslint-disable-next-line vue/no-dupe-keys
const { disabled, options } = toRefs(props);

const emit = defineEmits(["update:modelValue"]);

const disableText = computed(() => disabled.value || !options.value.length);
const placeholderText = computed(() => (!options.value.length ? "There are options to search." : props.placeholder));

const updateValue = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit("update:modelValue", target.value);
};
</script>

<template>
    <input v-bind="$attrs" class="form-control" :list="`${input}Options`" :id="input" :placeholder="placeholderText" :value="modelValue" @input="updateValue" :disabled="disableText" />
    <datalist :id="`${input}Options`">
        <option v-for="option in options" :value="option" v-bind:key="option"></option>
    </datalist>
</template>
