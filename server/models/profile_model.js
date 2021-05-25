require('dotenv').config()
const { createHash } = require('crypto') // 引入密碼
const jwt = require('jsonwebtoken') // 製作前端加密 token

async function addpass (password) {
  const hash = createHash('sha256') // 創建一個新的hash，使用sha256
  hash.update(password)
  return await hash.digest('hex')
}

async function create_JWT_token(data){
  const token = jwt.sign(data, process.env.JWT_key, { expiresIn: '3600s' })
  return token
}


async function decod_JWT(token){

  let decoded =''
  try {
    decoded = jwt.verify(token, process.env.JWT_key)
  } catch (error) {
    return
  }
  
  return decoded
}




module.exports = {
  addpass,
  create_JWT_token,
  decod_JWT
}