const express = require('express')
const bodyParser = require('body-parser')

const app = express();
const port = 3001

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// GET 请求
app.get('/api/hello', (req, res) => {
    res.send('Hello World!');
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
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  })