import axios from 'axios'

// Базовый URL API (меняется в зависимости от среды)
const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.8.115:9876/api/v1'

// Создаем экземпляр axios
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

export default api