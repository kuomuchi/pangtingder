require("dotenv").config()
const mysql = require("mysql")
const { promisify } = require("util")
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

module.exports = {
	query
}
