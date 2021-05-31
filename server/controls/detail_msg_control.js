// const { 
//     getRecommend,
// } = require('../models/recommend_model')

const { query } = require('../models/mysql_model')

const sendDetailMsg = async (req, res) => {
    const classMsg = req.body;
    const userInfo = req.userData

    if(!userInfo){
        res.send('false')
        return
    }

    console.log(classMsg.msg)
    const sendData = [classMsg.class_number, userInfo.id, userInfo.name, classMsg.msg]

    let sql = "INSERT INTO `pangtingder`.`detail_msg` (`class_number`, `user_id`, `user_name`, `class_msg`) VALUES (?, ?, ?, ?)"

    await query(sql, sendData)

    res.send('success')
    
}

const serviceData = async (req, res) => {

    const userData = req.userData
    console.log(userData)

    if(userData){
        const package = [userData.id, userData.id]
        const histiryMsg = await query("SELECT * FROM pangtingder.service WHERE user_id = ? OR sendTo = ?", package)
        
        const reSend = [histiryMsg, userData]

        if(userData.root === 'admin'){
            const getUserId = await query("SELECT user_id, user_name FROM pangtingder.service group by user_id")
            reSend.push(getUserId)
        }
        
        res.send(reSend)
    }else{
        const resend = {
            data: 'failure'
        }
        res.send(resend)
    }
    
}


const servicePostMsg = async (req, res) => {
    const userData = req.userData

    let nowTime = new Date().toLocaleString('zh-TW');

    const sendDB = []
    sendDB.push(userData.name)
    sendDB.push(userData.id)
    sendDB.push(req.body.sendTo)
    sendDB.push(req.body.content)
    sendDB.push(nowTime)

    let sql = "INSERT INTO `pangtingder`.`service` (`user_name`, `user_id`, `sendTo`, `content`, `time`) VALUES (?, ?, ?, ?, ?)"
    await query(sql, sendDB)

    if(userData){
        res.send(userData)
    }else{
        const resend = {
            data: 'failure'
        }
        res.send(resend)
    }
    
}


module.exports = {
    sendDetailMsg,
    serviceData,
    servicePostMsg
}