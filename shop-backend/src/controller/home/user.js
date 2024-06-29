const Base = require('./base.js');

module.exports = class extends Base {
  indexAction (loginUser) {
    return this.success(loginUser);
  }
};
