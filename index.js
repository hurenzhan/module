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
    this.exports = {}; // 要导出的内容
  }

  static _cache = {} // 做缓存

  static _extensions = {
    '.js'(module) {
      const script = fs.readFileSync(module.filePath, 'utf8'); // 读取用户文件
      const template = `(function(exports, module, require, __filename, __dirname){${script}})`; // 创建执行函数体
      const compileFunction = vm.runInThisContext(template); // 创建可执行函数
      const exports = module.exports; // 实现一个简写
      const filename = module.filePath; // 获取文件名绝对路径
      const dirname = path.dirname(filename); // 获取模块文件夹
      compileFunction.call(exports, exports, module, _require, filename, dirname)
    },
    '.json'(module) {
      const script = fs.readFileSync(module.filePath, 'utf8'); // 读取用户文件
      module.export = JSON.parse(script); // 直接转成json返回
    }
  }; // 策略模式

  // 处理路径和文件名
  static _resolveFilename(filename) {
    const filePath = path.resolve(__dirname, filename);
    const exists = fs.existsSync(filePath);
    if (exists) return filePath;  // 如果存在直接返回
    const keys = Reflect.ownKeys(Module._extensions); // 获取策略模式keys
    for (const key of keys) {
      const filePathExt = filePath + key;
      if (fs.existsSync(filePathExt)) return filePathExt;
    }
    throw new Error('module not found');
  }

  load() {
    const extension = path.extname(this.filePath); // 获取文件后缀名
    Module._extensions[extension]?.(this); // 根据后缀名使用策略
  }
}

/**
 * @一
 * @核心函数模块
 * @description 处理模块名 拼接路径 缓存模块 加载模块 导出模块
 * @param {String} filename 文件名路径
 */
function _require(filename) {
  const filePath = Module._resolveFilename(filename); // 1.__dirname + 文件相对路径获得文件绝对路径
  const cache = Module._cache[filePath]; // 读缓存
  if (cache) return cache.exports; // 2.如果有缓存，直接返回
  const module = new Module(filePath); // 新建模块
  Module._cache[filePath] = module; // 加入缓存
  module.load(); // 3.加载模块内容，包装新的函数执行，把用户模块赋值给module.export
  return module.exports;
}

const test = _require('test');
console.log(test, 'test');


