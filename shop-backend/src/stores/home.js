import { defineStore } from 'pinia'
import { reactive } from 'vue'

const useHome = defineStore('home', () => {
  const defaultHome = {
    isLogin: false,
    username: '',
    avatar: ''
  }
  const home = reactive(Object.assign({}, defaultHome))
  const updateHome = options => {
    Object.assign(home, options)
    return home
  }
  const removeHome = () => {
    Object.assign(home, defaultHome)
    return home
  }
  return { home, updateHome, removeHome }
}, {
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'home',
        storage: localStorage
      }
    ]
  }
})
export default useHome