import { notification } from 'ant-design-vue'

var notificationInstance = null

export default (options) => {
 notificationInstance && notificationInstance.close()
 notificationInstance = notification.open(options)
}
