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
    require('./server/routes/msg_route.js'),
    require('./server/routes/admin_route.js'),
])

app.use(function(req, res, next) {
  res.status(404).sendFile(__dirname + '/public/404.html');
});

io.on('connection', (socket) => {
    console.log('a user connected')

    // 傳送用戶訊息
    socket.on('sendMsg', (msg) => {
      console.log(msg)
      socket.broadcast.emit('sendMsg', msg)
    })
})

// 自動:D
// 自動修改評分
const { upDataRating } = require('./server/models/rating_model')
upDataRating()
setInterval(() => {
  upDataRating()
}, 86400000);


// 爬取coursera
// const { main } = require('./server/crawlers/coursera_crawlers/coursera_class')
// main()



// 爬取unschool
// const { main } = require('./server/crawlers/ntu_crawlers/urschool_comment')

// main('https://urschool.org/ntu/list?page=1')