require('dotenv').config()
const { query } = require('./mysql_model')

const accountMsg = async (package) => {
  const histiryMsg = await query("SELECT user_name, user_id, sendTo, content FROM service WHERE user_id = ? OR sendTo = ?", package)
  return histiryMsg
}

module.exports = {
  accountMsg
}