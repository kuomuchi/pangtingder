require('dotenv').config() // env

const express = require('express')
const path = require('path')
const app = express()
const socketio = require('socket.io')

const bodyParser = require('body-parser')


app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public')); // 可以以「/admin」為前提在，public裡獲取資料。
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const http = require('http')

const server = http.createServer(app)
const io = socketio(server, { cors: { origin: '*' } })

server.listen(3000, () => {
  console.log('run on 3000')
})


app.use('/', [
    require('./server/routes/getClassData_route.js'),
    require('./server/routes/ntu_updata_route.js'),
    require('./server/routes/profile_route.js'),
    require('./server/routes/msg_route.js')
])

io.on('connection', (socket) => {
    console.log('a user connected')
})