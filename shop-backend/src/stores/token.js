import { defineStore } from 'pinia'
import { ref } from 'vue'
const useToken = defineStore('token', () => {
  const token = ref(null)
  const updateToken = (val) => token.value = val
  const removeToken = () => token.value = null
  return { token, updateToken, removeToken }
}, {
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'token',
        storage: localStorage
      }
    ]
  }
})
export default useToken