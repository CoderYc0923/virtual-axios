import axios from 'axios'
// import virtualAxios from 'virtual-axios' 

// //创建一个axios实例

const service = axios.create({
    baseURL: 'http://localhost:3001',
    headers: {
        'Content-Type': 'application/json'
    }
})

export default service



// //通过virtual-axios对service进行加工

// const request = virtualAxios(service)

// //最后输出axios实例

// export default request