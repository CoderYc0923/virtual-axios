import axios from 'axios'
import AxiosFactory from 'axios-factory/index'

// //创建一个axios实例

const service = axios.create({
    baseURL: 'http://localhost:3001',
    headers: {
        'Content-Type': 'application/json'
    }
})

//通过axios-factory对service进行加工

const config = {

}

const axiosInstance = new AxiosFactory(service, config)

const request = axiosInstance.getvirtualAxios()

//最后输出axios实例

export default request