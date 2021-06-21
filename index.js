const path = require('path');
const fs = require('fs');
const vm = require('vm');

/**
 * @二
 * @核心类
 * @description 导出的模块
 */
class Module {
  constructor(filePath) {
    this.filePath = filePath; // 要导入的路径
    this.export = {}; // 要导出的内容
    this._cache = {}; // 做缓存
  }

  _extensions = {
    '.js'(module) {
      // const script = fs.readFileSync(this.filePath, 'utf8');
      console.log(module.filePath, 'Module.filePath');
    }
  }; // 策略模式

  // 
  static _resolveFilename(filename) {
    const filePath = path.resolve(__dirname, filename);
    const exists = fs.existsSync(filePath);
    if (exists) return filePath;  // 1.如果存在直接返回
    // let keys = Reflect.ownKeys(Module._extensions); // 2.获取策略模式keys
    const m = new Module('ddd')
    m.ss()
  }

  ss() {
    this._extensions['.js'](this);
  }
}



// 1.核心函数模块
// 处理模块名，拼接路径 缓存模块 加载模块 导出模块
/**
 * @一
 * @核心函数模块
 * @description 处理模块名 拼接路径 缓存模块 加载模块 导出模块
 * @param {String} filename 文件名路径
 */
function _require(filename) {
  const filePath = Module._resolveFilename(__dirname + filename); // 1.__dirname + 文件相对路径获得文件绝对路径
}

_require('sss')