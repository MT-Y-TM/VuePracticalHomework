import router from './'
import useToken from '../stores/token'
import notification from '../utils/notification'

const whiteList = ['/login']

router.beforeEach((to, from, next) => {
    document.title = to.meta.title + ' - ' + '后台管理系统'
    const { token } = useToken()
    if (token) {
        next()
    } else {
    if (whiteList.includes(to.path)) {
        next()
        } else {
            notification({
                message: '请先登录',
                type: 'error'
            })
        next('/login')
        }
    }
})
       