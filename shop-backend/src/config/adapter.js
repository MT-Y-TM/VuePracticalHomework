const fileCache = require('think-cache-file');
const nunjucks = require('think-view-nunjucks');
// const fileSession = require('think-session-file');
const mysql = require('think-model-mysql');
const {Console, File, DateFile} = require('think-logger3');
const path = require('path');
const JWTSession = require('think-session-jwt');

const isDev = think.env === 'development';

/**
 * cache adapter config
 * @type {Object}
 */
exports.cache = {
  type: 'file',
  common: {
    timeout: 24 * 60 * 60 * 1000 // millisecond
  },
  file: {
    handle: fileCache,
    cachePath: path.join(think.ROOT_PATH, 'runtime/cache'), // absoulte path is necessarily required
    pathDepth: 1,
    gcInterval: 24 * 60 * 60 * 1000 // gc interval
  }
};

/**
 * model adapter config
 * @type {Object}
 */
exports.model = {
  type: 'mysql',
  common: {
    logConnect: isDev,
    logSql: isDev,
    logger: msg => think.logger.info(msg)
  },
  mysql: {
    handle: mysql,
    database: 'vueshop',
    prefix: 'vueshop_',
    encoding: 'utf8mb4',
    host: '127.0.0.1',
    port: '',
    user: 'root',
    password: '123456',
    dateStrings: true
  }
};

/**
 * session adapter config
 * @type {Object}
 */
// exports.session = {
//   type: 'file',
//   common: {
//     cookie: {
//       name: 'thinkjs'
//       // keys: ['werwer', 'werwer'],
//       // signed: true
//     }
//   },
//   file: {
//     handle: fileSession,
//     sessionPath: path.join(think.ROOT_PATH, 'runtime/session')
//   }
// };

/**
 * think-session-jwt
 * @type {Object}
 */
exports.session = {
  type: 'jwt',
  common: {
    cookie: {
      name: 'thinkjs'
    }
  },
  jwt: {
    handle: JWTSession,
    secret: '《Vue.js前端开发实战（第2版）》教材配套项目secret', // secret is reqired
    tokenType: 'header', // ['query', 'body', 'header', 'cookie'], 'cookie' is default
    tokenName: 'jwt', // if tokenType not 'cookie', this will be token name, 'jwt' is default
    sign: {
      // sign options is not required
      // expiresIn: '10h'// token有效期
    },
    verify: {
      // verify options is not required
    },
    verifyCallback: any => any // default verify fail callback
  }
};


/**
 * view adapter config
 * @type {Object}
 */
exports.view = {
  type: 'nunjucks',
  common: {
    viewPath: path.join(think.ROOT_PATH, 'view'),
    sep: '_',
    extname: '.html'
  },
  nunjucks: {
    handle: nunjucks
  }
};

/**
 * logger adapter config
 * @type {Object}
 */
exports.logger = {
  type: isDev ? 'console' : 'dateFile',
  console: {
    handle: Console
  },
  file: {
    handle: File,
    backups: 10, // max chunk number
    absolute: true,
    maxLogSize: 50 * 1024, // 50M
    filename: path.join(think.ROOT_PATH, 'logs/app.log')
  },
  dateFile: {
    handle: DateFile,
    level: 'ALL',
    absolute: true,
    pattern: '-yyyy-MM-dd',
    alwaysIncludePattern: true,
    filename: path.join(think.ROOT_PATH, 'logs/app.log')
  }
};
