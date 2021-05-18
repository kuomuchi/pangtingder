require('dotenv').config()
const mysql = require('mysql')
const { promisify } = require('util')
const env = process.env
const { dbHost, dbUser, dbPwd, dbDatabase } = env

const dbCreatePool = mysql.createPool({
  host: dbHost,
  user: dbUser,
  password: dbPwd,
  database: dbDatabase,
  connectionLimit: 10
})

// 最常用的
const query = promisify(dbCreatePool.query).bind(dbCreatePool)

// 可能會用的
// const transaction = promisify(dbCreatePool.beginTransaction).bind(dbCreatePool)
// const commit = promisify(dbCreatePool.commit).bind(dbCreatePool)
// const rollback = promisify(dbCreatePool.rollback).bind(dbCreatePool)

// // 呃...我不知道:D
// const end = promisify(dbCreatePool.end).bind(dbCreatePool)
// const format = (dbCreatePool.format).bind(dbCreatePool)

module.exports = {
  query
}
