const { query } = require('../models/mysql_model')
const { 
    decod_JWT
} = require('../models/profile_model')


const selectClass = async (req, res) => {

    let {
        popular,
        source,
        keyword
    } = req.body

    if(popular == '無'){
        popular = '*'
    }else if(popular == '評分'){
        popular = 'mark'
    }

    if(!keyword.trim()){
        keyword = '%'
    }else{
        keyword = '%'+keyword+'%'
    }

    const page = req.params.page;
    const selectArray = [source, keyword, keyword, popular,page*10]
    
    const allPage = await query("SELECT COUNT(*) as maxpage FROM pangtingder.class WHERE source = ? AND (class_name LIKE ? OR number LIKE ?) ORDER BY ? DESC", selectArray)

    let sql = "SELECT * FROM pangtingder.class WHERE source = ? AND (class_name LIKE ? OR number LIKE ?) ORDER BY ? DESC LIMIT ?, 10"

    

    if(!isNaN(page)){
        getData = await query(sql, selectArray)
        getData.push(JSON.parse(JSON.stringify(allPage[0])))
        res.send(getData)

    }else{
        res.send({'data': '給我數字啦！'})
    }

    
}


const getClassDetail = async (req, res) => {
    const userInfo = req.userData
    const number = req.params.number;
    let userId = userInfo.id

    console.log(userInfo)

    // 拿取課程detail資料
    let sql = 'SELECT * FROM class WHERE number = ?'
    let getData = await query(sql, number)
    getData = JSON.parse(JSON.stringify(getData))
    
    sql = 'SELECT id, user_name, class_msg FROM detail_msg WHERE class_number = ?'
    let detail_msg = await query(sql, number)

    // console.log(userInfo)
    // console.log(getData)

    //確認玩家是否有將其加入收藏
    if(userInfo !== 0){
        const packge = []
        packge.push(userInfo.email)
        packge.push(getData[0].number)
        sql = 'SELECT * FROM collect WHERE email = ? AND class_number = ?'
        const isCollect =  await query(sql, packge)

        if(isCollect.length){
            getData.push('1')
        }else{
            getData.push('0')
        }

    }else{
        getData.push('2')
    }


    if(!userId){
        userId = 0
    }

    getData.push(detail_msg)
    getData.push(userId)

    res.send(getData)

}


const addCollect = async (req, res) => {

    const token = req.body.token
    const number = req.body.number

    const getuser = await decod_JWT(token)
    console.log(getuser.email)

    const sendData = [getuser.email, number]
    let sql = "INSERT INTO collect (`email`, `class_number`) VALUES (?, ?)"

    try {
        await query(sql, sendData)
    } catch (error) {
        console.log(error)
    }

    
    
    res.send({data: 'success'})
    
}


module.exports = {
    selectClass,
    getClassDetail,
    addCollect
}