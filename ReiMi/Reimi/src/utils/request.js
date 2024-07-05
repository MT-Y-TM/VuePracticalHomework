import axios from 'axios'
import useToken from '../stores/token'
import { ElLoading } from 'element-plus'
import config from '../config'
import notification from './notification'
import router from '../router'


const baseURL = config.baseURL
var loadingInstance = null
const service = axios.create({ baseURL })

service.interceptors.request.use(config => {
    loadingInstance = ElLoading.service()
    const { token } = useToken()
    if (token) {
        config.headers.jwt = token
    }
    return config
});

service.interceptors.response.use(
    response => {
        loadingInstance.close()
        const { errno, data, errmsg } = response.data
        if (errno === 0) {
            if (errmsg !== '') {
                notification({
                    message: errmsg,
                    type: 'success'
                })
            }
            return data
        }
        notification({
            message: errmsg,
            type: 'error'
        })
        if (errno === 2) {
            router.push({ name: 'login' })
        }
        return false
    },
    error => {
        loadingInstance.close()
        notification({
            message: '请求失败',
            type: 'error'
        })
        console.error(error)
        return Promise.reject(error)
    }
)

export default service
