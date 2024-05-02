import axios from 'axios'
import { store } from '../store'
import { addToken } from '../features/tokenReducer'
import { redirect } from 'react-router-dom' 

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3005'
})

axiosInstance.interceptors.request.use(
    (config) => {
        const token = store.getState().tokens // Obtener el token del store
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

axiosInstance.interceptors.response.use(
    (response) => {
        return response
    },
    async (error) => {
        const token = store.getState().tokens
        const originalRequest = error.config
        if (error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true

            const { data } = await axiosInstance.post('/auth/refresh', {
                token
            })
            store.dispatch(addToken(data.token))
            return axiosInstance(originalRequest)
        }
        if (error.response.status === 401) {
            redirect('/login')
        }
        return Promise.reject(error)
    }
)

export default axiosInstance
