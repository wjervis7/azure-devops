import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import BsDataList from "../BsDatalist.vue";

describe("BsDataList", () => {
    it("renders properly", () => {
        const wrapper = mount(BsDataList, {
            props: {
                input: "test",
                placeholder: "test",
                modelValue: "test",
                options: []
            }
        });

        const input = wrapper.find("input#test");
        const datalist = wrapper.find("datalist#testOptions");

        expect(input.exists()).toBe(true);
        expect(datalist.exists()).toBe(true);
    });
});
