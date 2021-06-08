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

    if(!keyword.trim()){
        keyword = '%'
    }else{
        keyword = '%'+keyword+'%'
    }

    if(source === '無'){
        source = '%'
    }


    const page = req.params.page;
    const selectArray = [source, keyword, keyword, keyword, keyword, page*10]
    
    // 抓取資料的頁數
    const allPage = await query("SELECT COUNT(*) as maxpage FROM pangtingder.class WHERE source like ? AND (class_name LIKE ? OR number LIKE ? OR professor LIKE ? OR source LIKE ?)", selectArray)

    let sql = "SELECT * FROM pangtingder.class WHERE source like ? AND (class_name LIKE ? OR number LIKE ? OR professor LIKE ? OR source LIKE ?) LIMIT ?, 10"

    if(popular == '評分'){
        sql = "SELECT * FROM pangtingder.class WHERE source like ? AND (class_name LIKE ? OR number LIKE ? OR professor LIKE ? OR source LIKE ?) ORDER BY mark DESC LIMIT ?, 10"
    }
    

    

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

    // 拿取課程detail資料
    let sql = 'SELECT * FROM class WHERE number = ?'
    let getData = await query(sql, number)
    getData = JSON.parse(JSON.stringify(getData))
    
    sql = 'SELECT user_id, user_name, class_msg FROM detail_msg WHERE class_number = ?'
    let detail_msg = await query(sql, number)

    const userStatus = {
        collect: '',
        rating: '',
        userId: '',
    }

    if(!userId){
        userId = 0
    }

    userStatus.userId = userId

    //確認玩家是否有將其加入收藏
    if(userInfo !== 0){
        const packge = []
        packge.push(userInfo.id)
        packge.push(getData[0].number)
        sql = 'SELECT * FROM collect WHERE user_id = ? AND class_number = ?'
        const isCollect =  await query(sql, packge)

        sql = 'SELECT mark FROM user_rating WHERE user_id = ? AND class_number = ?'

        let isUserRating =  await query(sql, packge)
        isUserRating = JSON.parse(JSON.stringify(isUserRating))

        if(isCollect.length){
            // 已經加入收藏
            userStatus.collect = 1
        }else{
            // 沒有加入收藏
            userStatus.collect = 0
        }

        if(isUserRating.length){
            //如果有收藏
            userStatus.rating = isUserRating[0].mark

        }else{
            //沒有評分
            userStatus.rating = 0
        }

        console.log(userInfo.name+ '進入' + number + ' 課程。\n收藏狀態: ' + userStatus.collect + '\n評分: ' + userStatus.rating + '\n\n')

    }else{
        // 如果用戶沒有登入
        userStatus.collect = -1
        userStatus.rating = -1
    }


    // // 該課程的推薦課程
    let getRecommendNumber = await query("SELECT recommend FROM pangtingder.recommend WHERE number = ?", number)
    getRecommendNumber = JSON.parse(JSON.stringify(getRecommendNumber))

    // 如果有課程
    if(getRecommendNumber.length){

        // 拿取所有的課程編號
        const recommendNumberArray = []
        for(let i = 0; i<getRecommendNumber.length; i++){
            recommendNumberArray.push(getRecommendNumber[i].recommend)
        }

        // 搜尋課程資料
        let getRecommendClass = await query("SELECT * FROM pangtingder.class WHERE number in (?)", [recommendNumberArray])
        getRecommendClass = JSON.parse(JSON.stringify(getRecommendClass))
        getRecommendNumber = getRecommendClass

    }else{
        // 否則回傳false
        getRecommendNumber = {
            data: 'false'
        }
    }

    getData.push(userStatus)
    getData.push(detail_msg)
    getData.push(getRecommendNumber)
    getData.push(userInfo)

    res.send(getData)

}


const addCollect = async (req, res) => {

    const number = req.body.number
    const userInfo = req.userData

    console.log('用戶: ' + userInfo.name +' 將 ' + number + '加入了收藏')


    const sendData = [userInfo.id, number]
    let sql = "INSERT INTO collect (`user_id`, `class_number`) VALUES (?, ?)"

    try {
        await query(sql, sendData)
    } catch (error) {
        console.log(error)
    }

    res.send({data: 'success'})
    
}

const addRating = async (req, res) => {
    try {
        const userInfo = req.userData
        const number = req.body.number
        const mark = req.body.mark
        const trueMark = +mark
        let package = [userInfo.id, number]

        

        // 檢查
        let sql = 'SELECT mark FROM user_rating WHERE user_id = ? AND class_number = ?'
        let isRating = await query(sql, package)
        isRating = JSON.parse(JSON.stringify(isRating))

        if(isRating.length){
            // 更新
            if(isRating.mark !== trueMark){
                const updata = [trueMark, userInfo.id, number]
                sql = "UPDATE user_rating SET mark = ? WHERE user_id = ? AND class_number = ?"
                await query(sql, updata)
            }

        }else{
            // 新增
            package.push(trueMark)
            sql = "INSERT INTO user_rating (user_id, class_number, mark) VALUES (?, ?, ?)"
            await query(sql, package)
        }
        
    } catch (error) {
        console.log(error)
        res.send('false')
        return
    }

    res.send('success')
    
}


const deleteCollect = async (req, res) => {
    const collect = req.body.collect
    const userInfo = req.userData
    
    

    const package = [userInfo.id, collect]

    let sql = "DELETE FROM collect WHERE user_id = ? AND class_number in (?)"

    try {
        await query(sql, package)
    } catch (error) {
        console.log(error)
    }

    console.dir(userInfo.name + '將' + collect + '從收藏中移除了')

    res.send({data: 'success'})
    
}


module.exports = {
    selectClass,
    getClassDetail,
    addCollect,
    deleteCollect,
    addRating
}