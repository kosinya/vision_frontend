import api from './index'

export const taskApi = {
    async getTasks() {
        const response = await api.get(`/tasks/day-maps`)
        return response.data
    },
    async getTask(id) {
        const response = await api.get(`/day-maps/${id}`)
        return response.data
    }
}