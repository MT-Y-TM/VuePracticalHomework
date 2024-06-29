const Base = require('./base.js');

module.exports = class extends Base {

  _isCheckLogin() {
    return false;
  }
  
  async listAction () {
    const category = think.model('category');
    const data = await category.select();
    data.forEach(item => {
      item.picture = this.getStaticURL(item.picture)
    });
    return this.success(data);
  }
}
