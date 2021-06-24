require('dotenv').config()
const { query } = require('./mysql_model')


const getLearnPageClass = async (popular, source, keyword, page) => {

  const selectArray = [source, keyword, keyword, keyword, keyword, page*10]

  const allPage = await query("SELECT COUNT(*) as maxpage FROM class WHERE source like ? AND (class_name LIKE ? OR number LIKE ? OR professor LIKE ? OR source LIKE ?)", selectArray)

  let sql = "SELECT * FROM class WHERE source like ? AND (class_name LIKE ? OR number LIKE ? OR professor LIKE ? OR source LIKE ?) LIMIT ?, 10"

  if(popular == '評分'){
      sql = "SELECT * FROM class WHERE source like ? AND (class_name LIKE ? OR number LIKE ? OR professor LIKE ? OR source LIKE ?) ORDER BY mark DESC LIMIT ?, 10"
  }

  if(!isNaN(page)){
    const getData = await query(sql, selectArray)
    getData.push(JSON.parse(JSON.stringify(allPage[0])))
    return getData
  }else{
    return {'data': '給我數字啦！'}
  }

}


const getDetailPageClass = async (userInfo, number) => {

  let sql = 'SELECT * FROM class WHERE number = ?'
  let getData = await query(sql, number)
  const userId = userInfo.id
  getData = JSON.parse(JSON.stringify(getData))
  
  
  sql = 'SELECT user_id, user_name, class_msg FROM detail_msg WHERE class_number = ?'
  let detail_msg = await query(sql, number)

  const userStatus = {
    collect: '',
    rating: '',
    userId: '',
  }

  if(!userId){
    userStatus.userId = 0

  }else{
    userStatus.userId = userId
  }

  // are user is collect?
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
      // is collect
      userStatus.collect = 1
    }else{
      // not collect
      userStatus.collect = 0
    }

    if(isUserRating.length){
      userStatus.rating = isUserRating[0].mark

    }else{
      userStatus.rating = 0
    }

    console.log(userInfo.name+ '進入' + number + ' 課程。\n收藏狀態: ' + userStatus.collect + '\n評分: ' + userStatus.rating + '\n\n')

  }else{
    
    userStatus.collect = -1
    userStatus.rating = -1
  }


  
  let getRecommendNumber = await query("SELECT recommend FROM recommend WHERE number = ?", number)
  getRecommendNumber = JSON.parse(JSON.stringify(getRecommendNumber))

  
  if(getRecommendNumber.length){

    
    const recommendNumberArray = []
    for(let i = 0; i<getRecommendNumber.length; i++){
        recommendNumberArray.push(getRecommendNumber[i].recommend)
    }

    
    let getRecommendClass = await query("SELECT * FROM class WHERE number in (?)", [recommendNumberArray])
    getRecommendClass = JSON.parse(JSON.stringify(getRecommendClass))
    getRecommendNumber = getRecommendClass

  }else{
    
    getRecommendNumber = {
        data: 'false'
    }
  }

  getData.push(userStatus)
  getData.push(detail_msg)
  getData.push(getRecommendNumber)
  getData.push(userInfo)

  return getData
}


const collect = async (number, userInfo) => {
  const sendData = [userInfo.id, number]
  let sql = "INSERT INTO collect (`user_id`, `class_number`) VALUES (?, ?)"
  try {
    await query(sql, sendData)
  } catch (error) {
    console.log(error)
    return
  }
  return {data: 'success'}
}

const rating = async (userInfo, number, trueMark) => {

  try {
    let package = [userInfo.id, number]

    // check
    let sql = 'SELECT mark FROM user_rating WHERE user_id = ? AND class_number = ?'
    let isRating = await query(sql, package)
    isRating = JSON.parse(JSON.stringify(isRating))

    if(isRating.length){
      // updata
      if(isRating.mark !== trueMark){
        const updata = [trueMark, userInfo.id, number]
        sql = "UPDATE user_rating SET mark = ? WHERE user_id = ? AND class_number = ?"
        await query(sql, updata)
      }

    }else{
      // add
      package.push(trueMark)
      sql = "INSERT INTO user_rating (user_id, class_number, mark) VALUES (?, ?, ?)"
      await query(sql, package)
    }
    
} catch (error) {
  console.log(error)
  return 'false'
}

return 'success'
}



const removeCollect = async (collect, userInfo) =>{
  const package = [userInfo.id, collect]

  let sql = "DELETE FROM collect WHERE user_id = ? AND class_number in (?)"

  try {
    await query(sql, package)
  } catch (error) {
    console.log(error)
    return {data: 'false'}
  }

  return {data: 'success'}
}


module.exports = {
  getLearnPageClass,
  getDetailPageClass,
  collect,
  rating,
  removeCollect
}
