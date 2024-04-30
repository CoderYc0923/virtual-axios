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
    pollings: [
        {
            scopePort: '/api/hello?code'
        }
    ]
}

const axiosInstance = new AxiosFactory(service, config)

const pollingAxios = axiosInstance.getvirtualAxios()

// 任然可以自定义添加拦截逻辑
pollingAxios.interceptors.request.use((config: any) => {
    console.log('拦截了', config);
    
    return config
})

//最后输出axios实例

export default pollingAxios