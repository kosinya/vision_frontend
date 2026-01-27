import api from './index'

export const taskApi = {
    async getTasks() {
        const response = await api.get(`/tasks/day-maps`)
        return response.data
    },
    async getTask(id) {
        const response = await api.get(`/day-maps/${id}`)
        return response.data
    },
    async createTask(task, organization_id) {
        const response = await api.post(`/organizations/${organization_id}/day-maps`, task)
        return response.data
    },
    async scanVideo(task_id, data) {
        const response = await api.post(`/day-maps/${task_id}/scan-videos`, data)
        return response.data
    },
    async getVideos(task_id) {
        const response = await api.get(`day-maps/${task_id}/videos`)
        return response.data
    },
    async enqueueVideo(task_id) {
        const response = await api.post(`day-maps/${task_id}/enqueue`)
        return response.data
    },
    async getHls(id) {
        const response = await api.get(`videos/${id}/hls`)
        return response.data
    },
    async getHlsHTML(id) {
        const response = await api.get(`videos/${id}/hls.html`)
        console.log(response)
        return response.data
    },
    async generateReport(task_id) {
        const response = await api.post(`/day-maps/${task_id}/generate-report`)
        return response.data
    },
    async getReport(task_id) {
        const response = await api.get(`/day-maps/${task_id}/report?format=txt`)
        return response.data
    }
}