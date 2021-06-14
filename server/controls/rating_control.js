// const { 
//     getRecommend,
// } = require('../models/recommend_model')

const { upDataRating } = require('../models/rating_model')

const { query } = require('../models/mysql_model')

const routeUpDataRating = async (req, res) => {

    const userInfo = req.userData

    if(userInfo.root === 'admin'){
        console.log('now is good')
        upDataRating(1)
        res.send('yes')
    }else{
        res.send('false')
    }
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


const getAccountStatus = (req, res) => {
    const userInfo = req.userData

    const resend = {
        data: false
    }
    
    if(userInfo.root === 'admin'){
        resend.data = true
    }

    res.send(resend)
}


const upDateClass = async (req, res) => {
    const userInfo = req.userData
    const classDate = req.body

    const resend = {
        data: false
    }
    
    if(userInfo.root === 'admin'){

        let upDateArray = []
        upDateArray.push(classDate.class_name)
        upDateArray.push(classDate.department)
        upDateArray.push(classDate.professor)
        upDateArray.push(classDate.source)
        upDateArray.push(classDate.remarks)
        upDateArray.push(classDate.web_url)
        upDateArray.push(classDate.class_content)
        upDateArray.push(classDate.number)

        let sql = "UPDATE pangtingder.class SET class_name = ?,  department = ?, professor = ?, source = ?, remarks = ?, web_url = ?, class_content = ? WHERE number = ?"
        await query(sql, upDateArray)
        resend.data = true

        console.log('成功更新課程')

        res.send(resend)

    }else{
        res.send(resend)
    }

    
}
// 新增課程
const createClass = async (req, res) => {
    const userInfo = req.userData
    const classDate = req.body

    const resend = {
        data: false
    }
    
    if(userInfo.root === 'admin'){

        const upDateArray = []
        upDateArray.push(classDate.number)
        upDateArray.push(classDate.class_name)
        upDateArray.push(classDate.department)
        upDateArray.push(classDate.professor)
        upDateArray.push(classDate.source)
        upDateArray.push(classDate.remarks)
        upDateArray.push(classDate.web_url)
        upDateArray.push(classDate.class_content)

        

        let sql = 'INSERT INTO class (number, class_name, department, professor, source, remarks, web_url, class_content) VALUES (?)';
        await query(sql, [upDateArray])

        resend.data = true
        console.log('成功創建課程')
        res.send(resend)
    }else{
        res.send(resend)
    }

}


// 刪除課程

const deleteClass = async (req, res) => {
    const userInfo = req.userData
    const classDate = req.body

    const resend = {
        data: false
    }
    
    if(userInfo.root === 'admin'){

        let sql = 'DELETE FROM pangtingder.class WHERE (number = ?)'
        await query(sql, classDate.number)
        console.log('刪除課程:' + classDate.number)
        resend.data = true
        res.send(resend)
    }else{
        res.send(resend)
    }

}

const banUser = async (req, res) => {
    const userInfo = req.userData
    const {userId, status, root} = req.body
    
    if(root){
        sql = "UPDATE pangtingder.account SET root = ? WHERE (id = ?);"
        const package = [root, userId]
        await query(sql, package)
    }

    try {
        sql = "UPDATE pangtingder.account SET status = ? WHERE (id = ?);"
        const package = [status, userId]
        await query(sql, package)
        res.send('yes')

    } catch (error) {
        console.log(error)
        res.send('false')
    }
}

const getAccount = async (req, res) => {
    const userInfo = req.userData
    const {keyword, page, userId} = req.body


    if(userInfo.root === 'admin'){
        if(userId){
            const getAccountMsg = await query("SELECT count(user_id) as msgTime FROM pangtingder.detail_msg WHERE user_id = ?", userId)
            const getAccountCollect = await query("SELECT count(user_id) as collectTime FROM pangtingder.collect WHERE user_id = ?", userId)
            const resend = [getAccountMsg[0], getAccountCollect[0]]
            res.send(resend)

        }else{
            const package = [keyword, keyword, keyword, page*10]
            const getAllAccount = await query('SELECT * FROM pangtingder.account WHERE user_name like ? or email like ? or id like ? LIMIT ?, 10', package)
            res.send(getAllAccount)
        }
    

    }else{
        res.send('false')
    }

}


const getAuto = async (req, res) => {
    const userInfo = req.userData
    const {page, keyword} = req.body

    if(userInfo.root === 'admin'){
        const package = [keyword, page*10]
        const getAllAccount = await query('SELECT * FROM pangtingder.auto_work WHERE work like ? LIMIT ?, 10', package)
        res.send(getAllAccount)

    }else{
        res.send('false')
    }

}

// 更新課程
const autoUpdata = async (req, res) => {
    const userInfo = req.userData
    const {status, run, event} = req.body

    console.log(run)
    
    if(userInfo.root == 'admin'){
        let sql = ''

        if(run === 1){
            sql = "UPDATE pangtingder.auto_work SET status = ? WHERE (work = ?)"
        }else if(run ===  0){
            sql = "UPDATE pangtingder.auto_work SET status = ?, run = ? WHERE (work = ?);"
        }
        
        const package = [status, run, event]
        await query(sql, package)
        res.send('yes')
    }else{
        res.send('false')
    }
}



module.exports = {
    routeUpDataRating,
    getAccountMsg,
    getAccountStatus,
    upDateClass,
    createClass,
    deleteClass,
    banUser,
    getAccount,
    getAuto,
    autoUpdata
}