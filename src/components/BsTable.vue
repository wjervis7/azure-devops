<!-- eslint-disable vue/require-v-for-key -->
<script setup lang="ts" generic="TRow">
//import { RouterLink } from 'vue-router';
export interface Header {
    heading: string;
    dataProperty?: string;
    formatFunc?(row: any): string;
    linkTo?(row: any): string;
    linkText?(row: any): string;
    linkTarget?: string;
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
                <td v-for="(header, j) in headers" v-bind:key="`${i}-${j}`">
                    <template v-if="header.linkTo">
                        <a :href="header.linkTo(row)" :target="header.linkTarget">{{ header.linkText!(row) }}</a>
                    </template>
                    <template v-else-if="header.formatFunc">
                        {{ header.formatFunc(row) }}
                    </template>
                    <template v-else>
                        {{ getRowDataForHeader(row, header.dataProperty!) }}
                    </template>
                </td>
            </tr>
        </tbody>
    </table>
</template>
