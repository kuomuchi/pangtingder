// const { 
//     getRecommend,
// } = require('../models/recommend_model')

const { upDataRating } = require('../models/rating_model')

const { query } = require('../models/mysql_model')

const routeUpDataRating = async (req, res) => {

    upDataRating(1)
    res.send('finish')

}


const getAccountMsg = async (req, res) => {
    const userInfo = req.userData
    const specify = req.body.data

    console.log(specify)

    if(userInfo.root === 'admin'){
        const package = [specify, specify]
        
        const histiryMsg = await query("SELECT user_name, user_id, sendTo, content FROM pangtingder.service WHERE user_id = ? OR sendTo = ?", package)
        res.send(histiryMsg)
    }else{
        const resend = {
            data:'failure'
        }
        res.send(resend)
    }

}

module.exports = {
    routeUpDataRating,
    getAccountMsg
}