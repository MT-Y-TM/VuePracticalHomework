
module.exports = class extends think.Controller {
  async __before() {
    this._setCorsHeader()
    if (this.isMethod('options')) {
      return this.json({});
    }
    if (this._isCheckLogin()) {
      const user = think.model('user');
      const loginUser = await this._getLoginUser(user);
      if (!loginUser) {
        return this.fail(2, '用户未登录或登录已过期');
      }
      const result = await this._getUserinfoReady(loginUser);
      this.__after && await this.__after();
      return result;
    }
  }

  _setCorsHeader() {
    this.header('Access-Control-Allow-Origin', this.header('origin') || '*');
    this.header('Access-Control-Allow-Headers', 'content-type,jwt');
    this.header('Access-Control-Max-Age', '86400');
  }

  _isCheckLogin() {
    return true;
  }
  
  async _getLoginUser(userModel) {
    const user = await this.ctx.session('login');
    if (user && user.id) {
      const data = await userModel.field('id,username,avatar,salt').where({ id: user.id }).find();
      if (!think.isEmpty(data)) {
        if (data.avatar !== '') {
          data.avatar = this.getStaticURL(data.avatar)
        }
        return data;
      }
    }
    return null;
  }

  async _getUserinfoReady(loginUser) {
    if (this[this.ctx.action + 'Action']) {
      return await this[this.ctx.action + 'Action'](loginUser);
    }
    return this.fail('请求地址有误');
  }

  getStaticURL(path = '') {
    return this.ctx.config('userConfig').staticURL + path
  }
};
