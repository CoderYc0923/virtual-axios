import axios from 'axios'
import AxiosFactory from 'axios-factory/index'
import { BaseConfig } from 'axios-factory/type'

// //创建一个axios实例

const service = axios.create({
    baseURL: 'http://localhost:3001',
    headers: {
        'Content-Type': 'application/json'
    }
})

//通过axios-factory对service进行加工

const config: BaseConfig = {
    interceptors: [
        {
            type: 'request',
            coverAll: true,
            success: (config: any) => {
                console.log('config',config);
                
                console.log(`接口调用成功:${config.method} - ${config.url} 被捕获`)
            },
            error: (error: any) => {
                console.log(`接口调用失败:${error.config.method} - ${error.config.url} 被捕获`)
            }
        }
    ]
}

const axiosInstance = new AxiosFactory(service, config)

const allRequest = axiosInstance.getvirtualAxios()

//最后输出axios实例

export default allRequest