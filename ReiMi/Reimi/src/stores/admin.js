import { defineStore } from "pinia";
import { reactive } from 'vue';

const useAdmin = defineStore('admin', {
    state: () => ({
        admin: reactive({
            username: '',
            avatar: '',
        }),
    }),
    actions: {
        updateAdmin(options) {
            Object.assign(this.admin, options);
            return this.admin;
        },
        removeAdmin() {
            Object.assign(this.admin, {
                username: '',
                avatar: '',
            });
            return this.admin;
        },
    },
    persist: {
        enabled: true,
        strategies: [
            {
                storage: localStorage,
            }
        ]
    }
});

export default useAdmin;
