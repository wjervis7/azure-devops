<script setup lang="ts">
import { useSlots } from "vue";
defineProps({
    input: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: "text",
        validator: (prop: string) => ["text"].includes(prop)
    },
    placeholder: String,
    required: Boolean,
    modelValue: {
        type: [String, Number],
        required: true
    }
});

const emit = defineEmits(["update:modelValue"]);

const updateValue = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit("update:modelValue", target.value);
};

const slots = useSlots();
</script>

<template>
    <input :id="input" class="form-control" :type="type" :placeholder="placeholder" :required="required" :value="modelValue" @input="updateValue" />
    <small v-if="slots.description" class="text-muted">
        <slot name="description"></slot>
    </small>
    <div v-if="slots.validation" class="invalid-feedback">
        <slot name="validation"></slot>
    </div>
</template>
