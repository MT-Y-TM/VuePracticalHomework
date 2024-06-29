module.exports = class extends think.Model {
  passwordMD5 (password, salt) {
    return think.md5(think.md5(password) + salt);
  }
};
