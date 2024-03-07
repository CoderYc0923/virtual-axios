/**
 * 自定义拦截器执行顺序的类型：前置 | 后置
 */
type modes = 'pre' | 'after' 

/**
 * 接口匹配的类型: 全 | 模糊
 */
type matchModes = 'perfect' | 'fuzzy' 

/**
 * 拦截器的类型
 */
type types = 'request' | 'response' 

/**
 * 请求类型
 */
type methods = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'head' | 'options' 

/**
 * 拦截器的回调
 */
type callBack = (params: any) => any

/**
 * 拦截器的作用接口数组
 */
export type scopeArray = ScopeArrayItem[]

/**
 * 拦截器的作用接口数组项
 */
interface ScopeArrayItem {
    method?: methods,
    url: string,
    matchMode?: matchModes
}

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

