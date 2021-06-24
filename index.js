require('dotenv').config() // env

const express = require('express')
const path = require('path')
const app = express()

const bodyParser = require('body-parser')


const rateLimit = require('express-rate-limit') // 引入「限制打入次數」

const limiter = rateLimit({ // 設定post次數
  windowMs: 1000 * 60, // 1秒
  max: 60, // limit each IP to 10 requests per windowMs
  message: 'to Fast Requests'
})

const msgLimiter = rateLimit({ // 設定post次數
  windowMs: 1000 * 5, // 1秒
  max: 6, // limit each IP to 10 requests per windowMs
  message: 'to Fast Requests'
})


app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public')); // 可以以「/admin」為前提在，public裡獲取資料。
app.use(express.json());
app.use(express.urlencoded({ extended: true }))


const socketio = require('socket.io')
const http = require('http')

const server = http.createServer(app)
const io = socketio(server, { cors: { origin: '*' } })

server.listen(3000, () => {
  console.log('run on 3000')
})

app.use('/', [
  require('./server/routes/admin_route.js')
])


app.use('/', limiter,  [
    require('./server/routes/get_class_data_route.js'),
    require('./server/routes/ntu_updata_route.js'),
    require('./server/routes/profile_route.js')
])

app.use('/', msgLimiter, [
  require('./server/routes/msg_route.js')
])


app.use((req, res, next) => {
  res.status(404).sendFile(__dirname + '/public/404.html');
});

// socket io
io.on('connection', (socket) => {
    console.log('a user connected')

    // sending msg to account
    socket.on('sendMsg', (msg) => {
      console.log(msg)
      socket.broadcast.emit('sendMsg', msg)
    })
})


module.exports = app;