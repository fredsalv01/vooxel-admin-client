import axios from 'axios'
import { store } from '../store'
import { addToken } from '../features/tokenReducer'
import { redirect } from 'react-router-dom' 

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BACK,
    timeout: 10000 // 10s.
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
        const originalRequest = error.config
        if (error.response) {
            switch (error.response.status) {
                case 403:
                    if (!originalRequest._retry) {
                        originalRequest._retry = true
                        const { data } = await axiosInstance.post('/auth/refresh', {
                            token: store.getState().tokens
                        })
                        store.dispatch(addToken(data.token))
                        return axiosInstance(originalRequest)
                    }
                    break
                case 401:
                    redirect('/login')
                    break
                case 404:
                    console.error('Requested resource not found')
                    break
                default:
                    console.error(error.response.data.message)
            }
        } else if (error.request) {
            console.error('Request was made but no response was received')
        } else {
            console.error('Something happened in setting up the request')
        }
        return Promise.reject(error)
    }
)

export default axiosInstance
