import { defineStore } from "pinia";
import { AES, Utf8, mode } from "jscrypto/es6";

const key = Utf8.parse("x4Wa6p@2y9Yykss6qQDsf7YAtZw622Ex");
const iv = Utf8.parse("y8sZJ*EnB*y3*EzR");

const cipher = AES.encrypt("azure:pat", key, {
    iv,
    mode: mode.CBC
});

const patKey = cipher.toString();;

export const azureStore = defineStore("azure", {
    state: () => {
        const encryptedPat = localStorage.getItem(patKey) || "";

        let _pat;

        if (encryptedPat) {
            const cipher = AES.decrypt(encryptedPat, key, {
                iv,
                mode: mode.CBC
            });
            _pat = cipher.toString(Utf8);
        } else {
            _pat = "";
        }

        return {
            _pat
        };
    },
    getters: {
        pat: (state) => state._pat
    },
    actions: {
        setPat(value: string) {
            this._pat = value;
            const cipher = AES.encrypt(value, key, {
                iv,
                mode: mode.CBC
            });
            localStorage.setItem(patKey, cipher.toString());
        }
    }
});
