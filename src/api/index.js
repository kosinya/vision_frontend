import axios from 'axios'
import { config } from '@/config'

// Базовый URL API
const API_URL = config.API_URL

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

export default api