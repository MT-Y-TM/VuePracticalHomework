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
    const user = think.model('user');
    const userExists = user.field('id').where({ 'username': input.username }).find();
    if (!think.isEmpty(userExists)) {
      return this.fail('用户名已存在');
    }
    const salt = think.md5(Math.random());
    const insertId = await user.add({ username: input.username, password: user.passwordMD5(input.password, salt), salt});
    const token = await this.ctx.session('login', { id: insertId });
    return this.success({ id: insertId, token, username: input.username, avatar: '' }, '注册成功');
  }
};
