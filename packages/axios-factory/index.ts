import { BaseConfig, Interceptor, scopeArray } from "./type";
import { mySetInterval } from "./tools";


class AxiosFactory {
  private instance: any
  private config: BaseConfig
  private retryMap: Map<string, number>
  private pendingMap: Map<string, any>
  private pollingMap: Map<string, any>
  private MAX_RETRY_COUNT: number = 5
  private INTERVAL_TIME: number = 1000
  private DEFAULT_MODE: string = 'pre'

  constructor(axios: any, config: BaseConfig) {
    this.instance = axios;
    this.config = config;
    this.retryMap = new Map();
    this.pendingMap = new Map();
    this.pollingMap = new Map()
    this.setPollingMap();

    const mode = this.config?.customMode || this.DEFAULT_MODE
    if (mode === 'pre') {
      this.setCustomInterceptors()
      this.setFactoryInterceptors()
    } else {
      this.setFactoryInterceptors()
      this.setCustomInterceptors()
    }
  }

  //返回改造后的实例
  getvirtualAxios() {
    return this.instance
  }

  /**
   * 接口匹配器
   * @param interfaces 自定义拦截器配置项
   * @param method 当前拦截到的请求方法
   * @param url 当前拦截到的url
   * 
   * @description 匹配规则：
   * 1.method: 若表明method，则在method下的url进行匹配；若未表明，则所有方法下的url
   * 2.matchMode: 若为'perfect',则对经过method处理的url进行全字符匹配;若为'fuzzy',则对经过method处理的url进行部分匹配
   */
  interfaceMatcher(interfaces: scopeArray, url: string, method: string) {
    for (let item of interfaces) {
      //默认全匹配
      const mode = item?.matchMode || 'perfect'
      const customMethod = (item?.method || '').toLocaleLowerCase();
      const interceptMethod = method.toLocaleLowerCase();

      if (item?.method) {
        if (mode === 'perfect' ? (customMethod + item.url) === (interceptMethod + url) : (customMethod === interceptMethod && url.includes(item.url))) {
          return true
        }
      } else {
        if (mode === 'perfect' ? item.url === url : url.includes(item.url)) {
          return true
        }
      }
    }
    return false
  }

  //配置自定义拦截器
  setCustomInterceptors() {
    const interceptors = this.config?.interceptors || []
    if (!interceptors.length) return;
    for (let interceptor of interceptors) {
      this.generateInterceptor(interceptor)
    }
  }

  //拦截器生成函数
  generateInterceptor(interceptor: Interceptor) {
    this.instance.interceptors[interceptor.type].use((config: any) => {
      const url = interceptor.type === 'request' ? config.url : config.config.url
      const method = interceptor.type === 'request' ? config.method : config.config.method
      if (interceptor.coverAll) interceptor.success(config)
      else if (this.interfaceMatcher(interceptor?.scopePorts || [], url, method)) interceptor.success(config)
      return config
    }, (error: any) => {
      if (interceptor.coverAll) error.success(error)
      else if (interceptor.scopePorts?.includes(error.config.url)) error.success(error)
      return Promise.reject(error)
    })
  }

  //工厂内部功能的拦截器
  setFactoryInterceptors() {
    this.instance.interceptors.request.use((config: any) => {
      //重复请求相关
      this.config.cancelRepeat?.enable && this.addPendingRequest(config)

      return config
    }, (error: any) => { })
    this.instance.interceptors.response.use((response: any) => {
      //重复请求相关
      this.config.cancelRepeat?.enable && this.removePendingRequest(response.config)
      this.setPolling(response.config)
      return response
    }, (error: any) => {
      //重试相关
      return this.setRetry(error)
    })
  }

  //配置重试
  setRetry(error: any) {
    const url = error.config.url
    const method = error.config.method
    const maxRetryCount = this.config.retry?.retryCount || this.MAX_RETRY_COUNT
    const intervalTime = this.config.retry?.intervalTime || this.INTERVAL_TIME

    if (!this.config.retry?.coverAll) {
      let urls = this.config.retry?.scopePorts || []
      if (!this.interfaceMatcher(urls, url, method)) return Promise.reject(error)
    }

    this.setRetryMap(url)
    const retryCount = this.retryMap.get(url) as number

    if (this.config.retry?.enable && retryCount < maxRetryCount) {
      this.retryMap.set(url, retryCount + 1);
      if (this.config.retry.log) console.log(`[${url}] is retry ${retryCount} times`)
      return new Promise(resolve => {
        setTimeout(() => resolve(this.instance(error.config)), intervalTime)
      })
    }

    return Promise.reject(error)
  }

  //重试Map配置
  setRetryMap(url: string) {
    if (!this.retryMap.has(url)) this.retryMap.set(url, 0);
  }

  /**
   * 配置取消重复请求
   * 原理：取消请求B，发送请求A
   * 维护一个pending队列，请求拦截add 相应拦截delete
   * @param config
   */
  //添加到队列
  addPendingRequest(config: any) {
    const url = config.url
    const method = config.method
    const urls = this.config.cancelRepeat?.scopePorts || []
    if (this.config.cancelRepeat?.coverAll || this.interfaceMatcher(urls, url, method)) {
      this.removePendingRequest(config)
      const id = this.getUrlId(config)
      const abortController = new AbortController()
      config.signal = abortController.signal
      if (!this.pendingMap.has(id)) {
        this.pendingMap.set(id, abortController)
      }
    }
  }

  //从队列中删除
  removePendingRequest(config: any) {
    const url = config.url
    const method = config.method
    const urls = this.config.cancelRepeat?.scopePorts || []
    if (this.config.cancelRepeat?.coverAll || this.interfaceMatcher(urls, url, method)) {
      const id = this.getUrlId(config)
      if (this.pendingMap.has(id)) {
        const abortController = this.pendingMap.get(id)
        abortController?.abort()
        this.pendingMap.delete(id)
      }
    }
  }

  //生成接口唯一id
  getUrlId(config: any) {
    return [config.url, config.method].join(':')
  }

  //配置轮询
  setPolling(config: any) {
    const url = this.getPathName(config.url)
    const pollingConfig = this.pollingMap.get(url)
    if (pollingConfig && !pollingConfig.timer) {
      let timer = mySetInterval(() => this.instance(config), pollingConfig.intervalTime)
      this.pollingMap.set(pollingConfig.scopePort, { ...pollingConfig, timer })
    }
  }

  //获取接口路由（除参数）
  getPathName(url: string) {
    const exampleDomain = 'http://example.com'
    const newUrl = new URL(url, exampleDomain)
    return newUrl.pathname
  }

  //初始化轮询Map
  setPollingMap() {
    const pollings = this.config.pollings || []
    //轮询配置的接口暂不允许配置全匹配和模糊
    //因考虑到轮询的接口一般为get，所以不把method考虑进去，而是根据url（除参数外）进行一个全匹配操作
    pollings.forEach(item => {
      if (!this.pollingMap.has(item.scopePort)) {
        let config = {
          ...item,
          timer: null
        }
        this.pollingMap.set(item.scopePort, config)
      }
    })
  }

}

export { AxiosFactory };
export default AxiosFactory