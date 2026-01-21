import api from './index'

export const taskApi = {
    async getTask(id) {
        const response = await api.get(`/day-maps/${id}`)
        return response.data
    },
}