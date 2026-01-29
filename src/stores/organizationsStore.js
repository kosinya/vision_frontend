import { defineStore } from 'pinia'
import {organizationsApi} from "@/api/organizationApi.js";
import {q} from "vue-router/dist/devtools-EWN81iOl.mjs";

export const organizationsStore = defineStore('organizations', {
    state: () => ({
        organizations: [],
        loading: false,
        error: null
    }),

    getters: {
        getOrganizations: (state) => {
            return state.organizations
        }
    },

    actions: {
        async loadOrganizations() {
            this.loading = true
            this.error = null

            try {
                await organizationsApi.getOrganizations().then(response => {
                    this.organizations = response
                }).catch(error => console.log(error))
            } catch (error) {
                this.error = error.message
            } finally {
                this.loading = false
            }
        }
    },
})