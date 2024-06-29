
module.exports = class extends think.Controller {

  async indexAction() {
    // 创建模型
    const admin = think.model('admin');
    const data = await admin.where({ id: 1 }).find();
    if (!think.isEmpty(data)) {
        return this.success('接口测试成功，数据库访问正常');
    }
    return this.fail('缺少用户数据！');
  }
}
