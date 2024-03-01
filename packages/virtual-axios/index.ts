import { BaseConfig, Interceptor } from "./type";


class virtualAxios {
  private instance: any
  private config: BaseConfig
  private retryMap: Map<string, number>
  private MAX_RETRY_COUNT: number = 5
  private INTERVAL_TIME: number = 1000
  constructor(axios: any, config: BaseConfig) {
    this.instance = axios;
    this.config = config;
    this.retryMap = new Map();
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
    }, (error: any) => { })
    this.instance.interceptor.response.use((response: any) => { }, (error: any) => {
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

  //重试
}

export { virtualAxios };
