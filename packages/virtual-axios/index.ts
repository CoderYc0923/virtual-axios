import { BaseConfig, Interceptor } from "./type";


class virtualAxios {
  private instance: any
  private config: BaseConfig
  constructor(axios: any, config: BaseConfig) {
    this.instance = axios;
    this.config = config
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

  //配置重试
  setRetry() {
    if (!this.config.retry?.enable) return;
    
  }
}

export { virtualAxios };
