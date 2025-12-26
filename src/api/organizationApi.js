import api from './index'

export const organizationsApi = {
    async getOrganizations() {
        const response = await api.get('/organizations')
        return response.data
    },

    async getOrganization(id) {
        const response = await api.get(`/organizations/${id}`)
        return response.data
    },

    async createOrganization(data) {
        const response = await api.post('/organizations', data)
        return response.data
    },

    async deleteOrganization(id) {
        const response = await api.delete(`/organizations/${id}`)
        return response.data
    },

    async getCameras(id) {
        const response = await api.get(`/organizations/${id}/camera-presets`)
        return response.data
    },
}