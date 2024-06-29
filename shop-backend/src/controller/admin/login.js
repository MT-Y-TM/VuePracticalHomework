const Base = require('./base.js');

module.exports = class extends Base {
  
  // 不检查登录
  _isCheckLogin() {
    return false;
  }

  async indexAction () {

    const input = {
      username: this.post('username') || '',
      password: this.post('password') || ''
    };

    const admin = think.model('admin');
    const data = await admin.where({ username: input.username }).find();

    if (think.isEmpty(data)) {
      return this.fail('用户名或密码有误！');
    }

    if (data.password !== admin.passwordMD5(input.password, data.salt)) {
      return this.fail('用户名或密码有误！');
    }
    
    const token = await this.ctx.session('login', { id: data.id });

    return this.success({ token }, '登录成功');
  }

};
