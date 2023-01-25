const express = require('express')
const app = express()
const port = 5000


const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://shj:4284@boilerplate.3xdz84w.mongodb.net/?retryWrites=true&w=majority', {
}).then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World!~~안녕')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

