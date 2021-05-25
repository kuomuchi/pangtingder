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


module.exports = {
    sendDetailMsg
}