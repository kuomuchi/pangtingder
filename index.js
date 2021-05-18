require('dotenv').config() // env

// const { main } = require('./server/crawlers/ntu_crawlers/ptt_comment.js')

const express = require('express')
const path = require('path')
const app = express()
const socketio = require('socket.io')

const http = require('http')

const server = http.createServer(app)
const io = socketio(server, { cors: { origin: '*' } })

server.listen(3000, () => {
  console.log('run on 3000')
})
