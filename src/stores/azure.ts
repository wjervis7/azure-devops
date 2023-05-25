import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { AES, Utf8, Base64, mode } from "jscrypto/es6";
import type { AESProps } from "jscrypto/es6/AES";

const key = Utf8.parse("x4Wa6p@2y9Yykss6qQDsf7YAtZw622Ex");
const iv = Utf8.parse("y8sZJ*EnB*y3*EzR");
const cipherProps: Partial<AESProps> = {
    iv,
    mode: mode.CBC
};

const encryptValue = (value: string) => {
    if (!value) {
        return "";
    }
    const cipher = AES.encrypt(value, key, cipherProps);
    return cipher.toString();
};

const decryptValue = (cipherText: string | null) => {
    if (!cipherText) {
        return "";
    }
    const cipher = AES.decrypt(cipherText, key, cipherProps);
    return cipher.toString(Utf8);
};

const patKey = encryptValue("azure:pat");
const orgKey = encryptValue("azure:org");
const projectKey = encryptValue("azure:project");
const repoKey = encryptValue("azure:repo");

const getLocalStorage = (storageKey: string) => decryptValue(localStorage.getItem(storageKey));
const setLocalStorage = (storageKey: string, value: string) => localStorage.setItem(storageKey, encryptValue(value));

export const azureStore = defineStore("azure", () => {
    const _pat = ref(getLocalStorage(patKey));
    const _org = ref(getLocalStorage(orgKey));
    const _project = ref(getLocalStorage(projectKey));
    const _repo = ref(getLocalStorage(repoKey));

    const pat = computed({
        get: () => _pat.value,
        set: (value: string) => {
            _pat.value = value;
            setLocalStorage(patKey, value);
        }
    });
    const org = computed({
        get: () => _org.value,
        set: (value: string) => {
            _org.value = value;
            setLocalStorage(orgKey, value);
        }
    });
    const project = computed({
        get: () => _project.value,
        set: (value: string) => {
            _project.value = value;
            setLocalStorage(projectKey, value);
        }
    });
    const repo = computed({
        get: () => _repo.value,
        set: (value: string) => {
            _repo.value = value;
            setLocalStorage(repoKey, value);
        }
    });

    const encodePat = (pat: string) => Base64.stringify(Utf8.parse(`:${pat}`));

    const clear = () => localStorage.clear();

    return {
        pat,
        org,
        project,
        repo,
        encodePat,
        clear
    };
});
