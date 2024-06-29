const Base = require('./base.js');

module.exports = class extends Base {

  indexAction (loginUser) {
    return this.success(loginUser);
  }

  async changePasswordAction (loginUser) {
    const input = {
      pwd: this.post('password') || ''
    };
    const admin = think.model('admin');
    const password = admin.passwordMD5(input.pwd, loginUser.salt);
    await admin.where({ id: loginUser.id }).update({ password });
    return this.success({}, '密码修改完成');
  }

  async changeAvatarAction (loginUser) {
    const input = {
      avatar: this.post('avatar')
    };
    const admin = think.model('admin');
    await admin.where({ id: loginUser.id }).update({ avatar: input.avatar });
    return this.success({}, '头像修改完成');
  }

};
