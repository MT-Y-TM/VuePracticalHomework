const Base = require('./base.js');
const fs = require('fs');
const path = require('path');
const rename = think.promisify(fs.rename, fs);

module.exports = class extends Base {

  async pictureAction() {
    const type = this.post('type');
    const allowTypes = [
      'admin_avatar',         // 管理员头像
      'category_picture',     // 分类图
      'goods_picture',        // 商品图
      'goods_album',          // 商品轮播图
      'goods_description'     // 商品描述图
    ];
    if (allowTypes.indexOf(type) < 0) {
      return this.fail('type字段设置有误');
    }
    const file = this.ctx.file('file');
    if (!file.name) {
      return this.fail('文件上传失败');
    }
    // 检查文件名
    const fileName = file.name;
    const fileExtName = fileName.substring(fileName.lastIndexOf('.'), fileName.length).toLowerCase();
    const allowExts = ['.jpg', '.jpeg', '.webp', '.png', '.gif'];
    if (allowExts.indexOf(fileExtName) < 0) {
      return this.fail('文件上传失败，允许的文件扩展名为：' + allowExts.join('|'));
    }
    // 检查文件大小
    const fileSizeLimit = 2 * 1024 * 1024;
    const fileSizeLimitStr = '2MB';
    if (file.size > fileSizeLimit) {
      return this.fail('文件上传失败，允许的文件大小为：' + fileSizeLimitStr);
    }
    // 保存文件
    const filename = think.uuid('v4') + fileExtName;
    const savepath = 'static/uploads/' + type + '/' + this._generateDateString() + '/' + filename;
    const filepath = path.join(think.ROOT_PATH, 'www/' + savepath);
    think.mkdir(path.dirname(filepath));
    await rename(file.path, filepath);
    if (!fs.existsSync(filepath)) {
      return this.fail('文件保存失败');
    }
    return this.success({ url: this.getStaticURL(savepath), savepath });
  }

  _generateDateString () {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const dateString = currentYear + '/' + (currentMonth < 10 ? '0' + currentMonth : currentMonth);
    return dateString;
  }
}
