const Base = require('./base.js');

module.exports = class extends Base {
  async indexAction() {
    const input = {
      id: this.get('id') || 0,
    };
    const category = think.model('category');
    const data = await category.where({ id: input.id }).find();
    return this.success(data);
  }

  async listAction() {
    const category = think.model('category');
    const data = await category.select();
    data.forEach(item => {
      if (item.picture !== '') {
        item.picture = this.getStaticURL(item.picture)
      }
    });
    return this.success(data);
  }

  async addAction() {
    const input = {
      name: this.post('name') || '',
      picture: this.post('picture') || '',
      pid: this.post('pid') || 0,
    };
    const category = think.model('category');
    if (input.pid !== 0) {
      const parent = await category.field('id').where({ id: input.pid, pid: 0 }).find();
      if (think.isEmpty(parent)) {
        return this.fail('上级分类有误');
      }
    }
    const insertId = await category.add({
      name: input.name,
      picture: input.picture,
      pid: input.pid,
    });
    return this.success({ insertId }, '新增成功');
  }

  async saveAction() {
    const input = {
      id: this.post('id') || 0,
      name: this.post('name') || '',
      picture: this.post('picture') || '',
      pid: this.post('pid') || 0,
    };
    const category = think.model('category');
    const data = await category.field('id').where({ id: input.id }).find();
    if (think.isEmpty(data)) {
      return this.fail('修改失败，分类不存在');
    }
    if (input.pid !== 0) {
      const parent = await category.field('id').where({ id: input.pid, pid: 0 }).find();
      if (think.isEmpty(parent)) {
        return this.fail('修改失败，上级分类有误');
      }
    }
    if (input.pid == input.id) {
      return this.fail('修改失败，上级分类有误');
    }
    await category.where({ id: input.id }).update({ name: input.name, picture: input.picture, pid: input.pid });
    return this.success({}, '修改成功');
  }

  async delAction() {
    const input = {
      id: this.post('id') || 0,
    };
    const category = think.model('category');
    const data = await category.field('id').where({ id: input.id }).find();
    if (think.isEmpty(data)) {
      return this.fail('删除失败，分类不存在');
    }
    await category.where({ id: input.id }).delete();
    return this.success({}, '删除成功');
  }
};
