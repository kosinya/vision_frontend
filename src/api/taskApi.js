import api from './index'

export const taskApi = {
    async getTasks() {
        const response = await api.get('/organizations')
        return response.data
    },

    async getTask(id) {
        const response = await api.get(`/organizations/${id}`)
        return response.data
    },

    async createTask(data) {
        const response = await api.post('/organizations', data)
        return response.data
    },

    async deleteTask(id) {
        const response = await api.delete(`/organizations/${id}`)
        return response.data
    },
}