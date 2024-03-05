import { BaseConfig, Interceptor } from "./type";
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
    this.instance.interceptor[interceptor.type].use((config: any) => {
      const url = interceptor.type === 'request' ? config.url : config.config.url
      if (interceptor.coverAll) config.success(config)
      else if (interceptor.scopePorts?.includes(url)) config.success(config)
      return config
    }, (error: any) => {
      if (interceptor.coverAll) error.success(error)
      else if (interceptor.scopePorts?.includes(error.config.url)) error.success(error)
      return Promise.reject(error)
    })
  }

  //工厂内部功能的拦截器
  setFactoryInterceptors() {
    this.instance.interceptor.request.use((config: any) => {
      //重复请求相关
      this.config.cancelRepeat?.enable && this.addPendingRequest(config)

      return config
    }, (error: any) => { })
    this.instance.interceptor.response.use((response: any) => {
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
    const maxRetryCount = this.config.retry?.retryCount || this.MAX_RETRY_COUNT
    const intervalTime = this.config.retry?.intervalTime || this.INTERVAL_TIME

    if (!this.config.retry?.coverAll) {
      let urls = this.config.retry?.scopePorts || []
      if (!urls.includes(url)) return Promise.reject(error)
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
    if (this.config.cancelRepeat?.coverAll || this.config.cancelRepeat?.scopePorts?.includes(config.rul)) {
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
    if (this.config.cancelRepeat?.coverAll || this.config.cancelRepeat?.scopePorts?.includes(config.rul)) {
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
    const pollingConfig = this.pollingMap.get(config.url)
    if (pollingConfig && !pollingConfig.timer) {
      let timer = mySetInterval(() => this.instance(config), pollingConfig.intervalTime)
      this.pollingMap.set(pollingConfig.scopePort, {...pollingConfig, timer})
    }
  }

  //初始化轮询Map
  setPollingMap() {
    const pollings = this.config.pollings || []
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