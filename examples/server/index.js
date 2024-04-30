const express = require('express')
const bodyParser = require('body-parser')
const cors = require('express-cors')

const app = express();
const port = 3001

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // * 表示允许所有域名访问，也可以设置成具体的域名，如：http://example.com
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization"); // 在这里添加允许的请求头字段
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS'); // 允许的请求方法
    next();
})

// GET 请求
app.get('/api/hello', (req, res) => {
    res.send(`Hello World!id:${req.query.code}`);
});

// POST 请求
app.post('/api/data', (req, res) => {
    const data = req.body;
    // 处理 POST 请求的数据
    res.json({ message: 'Data received', data });
});

// DELETE 请求
app.delete('/api/data/:id', (req, res) => {
    const id = req.params.id;
    // 根据 id 删除数据
    res.json({ message: `Data with ID ${id} deleted` });
});

// PUT 请求
app.put('/api/data/:id', (req, res) => {
    const id = req.params.id;
    const newData = req.body;
    // 根据 id 更新数据
    res.json({ message: `Data with ID ${id} updated`, newData });
});

//错误请求
// GET 请求
let count = 0
app.get('/api/hello/error', (req, res) => {
    res.status(401).send(`get error`);
});

// POST 请求
app.post('/api/data/error', (req, res) => {
    const data = req.body;
    // 处理 POST 请求的数据
    res.status(404).json({ message: 'Data received error' });
});

// DELETE 请求
app.delete('/api/data/error/:id', (req, res) => {
    const id = req.params.id;
    // 根据 id 删除数据
    res.status(404).json({ message: `Data with ID ${id} Error` });
});

// PUT 请求
app.put('/api/data/error/:id', (req, res) => {
    const id = req.params.id;
    const newData = req.body;
    // 根据 id 更新数据
    res.status(500).json({ message: `Data with ID ${id} updated error` });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})