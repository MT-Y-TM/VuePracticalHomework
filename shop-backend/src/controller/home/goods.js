const Base = require('./base.js');

module.exports = class extends Base {

  _isCheckLogin() {
    return false;
  }
  
  async indexAction() {
    const input = {
      id: this.get('id')
    };
    const albums = think.model('goods');
    const data = await albums.where({ id: input.id }).find();
    if (!think.isEmpty(data)) {
      data.picture = this.getStaticURL(data.picture)
    }
    return this.success(data);
  }

  async listAction() {
    const input = {
      last_id: this.get('last_id') || '0',
      pagesize: this.get('pagesize') || 1,
      category_id: this.get('category_id') || 0,
      id: this.get('id') || 0
    };
    const goods = think.model('goods');
    if (input.category_id) {
      goods.where({ 'category_id': input.category_id });
    }
    if (input.last_id != '0') {
      goods.where({ 'id': ['<', input.last_id] });
    }
    const data = await goods.order('id DESC').limit(input.pagesize).select();
    data.forEach(item => {
      item.picture = this.getStaticURL(item.picture)
    });
    return this.success(data);
  }

  async albumAction() {
    const input = {
      goods_id: this.get('goods_id')
    };
    const album = think.model('goods_album');
    const data = await album.where({ goods_id: input.goods_id }).select();
    data.forEach(item => {
      item.picture = this.getStaticURL(item.picture)
    });
    return this.success(data);
  }

  async cartAction() {
    const input = {
      ids: this.get('ids')
    };
    const carts = think.model('goods');
    const data = await carts.where({ id: ['IN', input.ids] }).select();
    data.forEach(item => {
      item.picture = this.getStaticURL(item.picture)
    });
    return this.success(data);
  }
}