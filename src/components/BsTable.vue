<!-- eslint-disable vue/require-v-for-key -->
<script setup lang="ts" generic="TRow">
export interface Header {
    heading: string;
    dataProperty: string;
}

defineProps<{
    headers: Header[];
    rows: TRow[];
}>();

const getRowDataForHeader = (row: any, header: string): string | number | boolean => {
    if (header.indexOf(".") >= 0) {
        const prop = header.split(".")[0];
        const subProp = header.split(".")[1];
        return getRowDataForHeader(row[prop], subProp);
    } else {
        return row[header];
    }
};
</script>

<template>
    <table class="table">
        <thead>
            <tr>
                <th scope="col" v-for="(header, i) in headers" v-bind:key="i">{{ header.heading }}</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(row, i) in rows" v-bind:key="i">
                <td v-for="(header, j) in headers" v-bind:key="`${i}-${j}`">{{ getRowDataForHeader(row, header.dataProperty) }}</td>
            </tr>
        </tbody>
    </table>
</template>
