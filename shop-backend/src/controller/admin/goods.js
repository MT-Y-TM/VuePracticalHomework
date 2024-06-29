const Base = require('./base.js');

module.exports = class extends Base {
  async indexAction() {
    const input = {
      id: this.get('id'),
    };
    const goods = think.model('goods');
    const goodsalbum = think.model('goods_album');
    const data = await goods.where({ id: input.id }).find();
    data.album = await goodsalbum.where({ goods_id: input.id }).select();
    data.album.forEach(item => {
      if (item.picture !== '') {
        item.picture = this.getStaticURL(item.picture)
      }
    });
    return this.success(data);
  }

  async listAction() {
    const input = {
      page: this.get('page') || 1,
      pagesize: this.get('pagesize') || 1,
    };
    let offset = 0;
    if (input.page > 1) {
      offset = (input.page - 1) * input.pagesize;
    }
    const goods = think.model('goods');
    const data = await goods.order('id DESC').limit(offset, input.pagesize).select();
    data.forEach(item => {
      if (item.picture !== '') {
        item.picture = this.getStaticURL(item.picture)
      }
    });
    const count = await goods.count();
    return this.success({
      total: count,
      list: data,
    });
  }

  async addAction() {
    const input = {
      category_id: this.post('category_id') || 0,
      name: this.post('name') || '',
      price: this.post('price') || 0,
      description: this.post('description') || '',
      picture: this.post('picture') || '',
      spec: this.post('spec') || '',
      stock: this.post('stock') || 0,
      album: this.post('album') || [],
    };
    if (!Array.isArray(input.album)) {
      return this.fail('添加失败，album格式有误');
    }
    const category = think.model('category');
    const parent = await category.field('id').where({ id: input.category_id }).find();
    if (think.isEmpty(parent)) {
      return this.fail('添加失败，分类不存在');
    }
    const goods = think.model('goods');
    const insertId = await goods.add({
      category_id: input.category_id,
      name: input.name,
      price: input.price,
      description: input.description,
      picture: input.picture,
      spec: input.spec,
      stock: input.stock,
    });
    const album = [];
    if (input.album.length > 0) {
      input.album.forEach((item) => {
        album.push({ picture: item, goods_id: insertId });
      });
    }
    const goodsAlbum = think.model('goods_album');
    if (album.length > 0) {
      await goodsAlbum.addMany(album);
    }
    return this.success({ insertId }, '添加成功');
  }

  async saveAction() {
    const input = {
      id: this.post('id') || 0,
      category_id: this.post('category_id') || 0,
      name: this.post('name') || '',
      price: this.post('price') || 0,
      description: this.post('description') || '',
      picture: this.post('picture') || '',
      spec: this.post('spec') || '',
      stock: this.post('stock') || 0,
      album: this.post('album') || [],
    };
    if (!Array.isArray(input.album)) {
      return this.fail('修改失败，album格式有误');
    }
    const goods = think.model('goods');
    const data = await goods.where({ id: input.id }).find();
    if (think.isEmpty(data)) {
      return this.fail('修改失败，商品不存在');
    }
    const category = think.model('category');
    const parent = await category.field('id').where({ id: input.category_id }).find();
    if (think.isEmpty(parent)) {
      return this.fail('修改失败，分类不存在');
    }
    const insertId = await goods.where({ id: input.id }).update({
      category_id: input.category_id,
      name: input.name,
      price: input.price,
      description: input.description,
      picture: input.picture,
      spec: input.spec,
      stock: input.stock,
    });
    const album = [];
    if (input.album.length > 0) {
      input.album.forEach((item) => {
        album.push({ picture: item, goods_id: input.id });
      });
    }
    const goodsAlbum = think.model('goods_album');
    if (album.length > 0) {
      await goodsAlbum.where({ goods_id: input.id }).delete();
      await goodsAlbum.addMany(album);
    }
    return this.success({ insertId }, '修改成功');
  }

  async delAction() {
    const input = {
      id: this.post('id') || 0,
    };
    const goods = think.model('goods');
    const data = await goods.field('id').where({ id: input.id }).find();
    if (think.isEmpty(data)) {
      return this.fail('删除失败，商品不存在');
    }
    await goods.where({ id: input.id }).delete();
    const goodsAlbum = think.model('goods_album');
    await goodsAlbum.where({ goods_id: input.id }).delete();
    return this.success({}, '删除成功');
  }
};
