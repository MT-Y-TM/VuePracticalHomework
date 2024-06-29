import { defineStore } from 'pinia'
import { reactive } from 'vue'

const useAdmin = defineStore('admin', () => {

  const defaultAdmin = {
    username: '',
    avatar: ''
  }

  const admin = reactive(defaultAdmin)

  const updateAdmin = options => {
    Object.assign(admin, options)
    return admin
  }

  const removeAdmin = () => {
    Object.assign(admin, defaultAdmin)
    return admin
  }

  return { admin, updateAdmin, removeAdmin }
}, {
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'admin',
        storage: localStorage
      }
    ]
  }
})

export default useAdmin