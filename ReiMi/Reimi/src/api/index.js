import request from '../utils/request'

// 登录接口
export function login(data) {
  return request.post('/admin/login',data)
}

// 用户信息接口
export function getAdmin(){
  return request.get('/admin/admin')
}

export function changeAdminPassword(data) {
  return request.post('/admin/admin/changePassword', data)
  }
  // 修改头像接口
  export function changeAdminAvatar(data) {
  return request.post('/admin/admin/changeAvatar', data)
  }
  // 更新图片地址
  export function uploadPictureURL() {
  return config.baseURL + '/admin/upload/picture'
  }