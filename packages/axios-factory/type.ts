/**
 * 自定义拦截器执行顺序的类型
 */
type modes = 'pre' | 'after' 

/**
 * 拦截器的类型
 */
type types = 'request' | 'response' 

/**
 * 拦截器的回调
 */
type callBack = (params: any) => any

/**
 * 拦截器的作用接口数组
 */
type scopeArray = string[]

/**
 * 基础工厂参数
 */
export interface BaseConfig {
    interceptors?: Interceptor[],
    retry?: RetryConfig,
    cancelRepeat?: CancelConfig,
    pollings?: Polling[],
    customMode?: modes
}


/**
 * 拦截器
 */
export interface Interceptor {
    type: types,
    scopePorts?: scopeArray,
    coverAll?: boolean,
    success: callBack,
    error: callBack
}

/**
 * 重试
 */
export interface RetryConfig {
    enable: boolean,
    log?: boolean,
    coverAll?: boolean,
    scopePorts?: scopeArray,
    retryCount?: number,
    intervalTime?: number
}

/**
 * 取消重复请求
 */
export interface CancelConfig {
    enable: boolean,
    coverAll?: boolean,
    scopePorts?: scopeArray,
}

/**
 * 轮询
 */
export interface Polling {
    scopePort: string,
    intervalTime?: number
}

