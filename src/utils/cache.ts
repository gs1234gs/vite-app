// 定义一个枚举类型 CacheType，用于指定缓存的类型
enum CacheType {
  // 缓存类型为 localStorage
  local,
  // 缓存类型为 sessionStorage
  session
}

// 定义一个 Cache 类，用于封装缓存操作
class Cache {
  // 定义一个存储对象，类型为 Storage（可以是 localStorage 或 sessionStorage）
  storage: Storage;

  // 构造函数，接收一个 CacheType 类型的参数，用于初始化存储对象
  constructor(type: CacheType) {
    // 根据传入的类型，初始化 storage 为 localStorage 或 sessionStorage
    this.storage = type === CacheType.local ? localStorage : sessionStorage;
  }

  // 设置缓存的方法
  setCache(key: string, value: any) {
    // 如果 value 存在，则将其转换为 JSON 字符串并存储到 storage 中
    if (value) {
      this.storage.setItem(key, JSON.stringify(value));
    }
  }

  // 获取缓存的方法
  getCache(key: string) {
    // 从 storage 中获取指定 key 的值
    const value = this.storage.getItem(key);
    // 如果值存在，则将其解析为 JSON 对象并返回
    if (value) {
      return JSON.parse(value);
    }
    // 如果值不存在，则返回 undefined（隐式返回）
  }

  // 移除指定 key 的缓存
  removeCache(key: string) {
    // 从 storage 中移除指定 key 的项
    this.storage.removeItem(key);
  }

  // 清空所有缓存
  clearCache() {
    // 清空 storage 中的所有项
    this.storage.clear();
  }
}

// 创建两个 Cache 实例，分别使用 localStorage 和 sessionStorage
const cacheLocal = new Cache(CacheType.local); // 用于操作 localStorage
const cacheSession = new Cache(CacheType.session); // 用于操作 sessionStorage

// 导出两个 Cache 实例，供其他模块使用
export{
  cacheLocal,
  cacheSession
};