const { query } = require('../models/mysql_model')

const upDataRating = async (admin) => {

    const getDB = await query("SELECT time, status, run FROM pangtingder.auto_work WHERE work = 'fixrating'")
    const getStatus = JSON.parse(JSON.stringify(getDB))[0].status
    const getRun = JSON.parse(JSON.stringify(getDB))[0].run

    if(getStatus){
        if(!+getRun){

            // 獲取時間

            let getTime = JSON.parse(JSON.stringify(getDB))[0].time
            getTime = getTime.split('/')
            getTime = getTime[0] + getTime[1] + getTime[2]
            getTime = getTime = getTime.split(' ')
            getTime = getTime[0]
            

            let nowTime = new Date().toLocaleString('zh-TW');

            let sortTime = nowTime
            sortTime = nowTime
            sortTime = sortTime.split('/')
            sortTime = sortTime[0] + sortTime[1] + sortTime[2]
            sortTime = sortTime = sortTime.split(' ')
            sortTime = sortTime[0]


            // 開始更新
            if(admin || +getTime < +sortTime){

                // 在DB設定，目前rating event正在執行。
                await query("UPDATE pangtingder.auto_work SET run = 1 WHERE (work = 'fixrating')")

                // 檢查目前的狀態
                async function getNowStatus(){
                    let data = await query("SELECT run FROM pangtingder.auto_work WHERE work = 'fixrating'")
                    data = JSON.parse(JSON.stringify(data))
                    return data[0].run
                }

                const number = []
                const className = []
                const calculation = []
                let allnumber = 0

                // 網路評分
                let data = await query('SELECT class_name, mark FROM web_comment;')
                const getWebMark = JSON.parse(JSON.stringify(data))


                // 用戶評分
                data = await query('SELECT class_number, mark FROM user_rating')
                const getAccountMark = JSON.parse(JSON.stringify(data))

                data = await query('SELECT professor, mark FROM pangtingder.professor')
                const getProfessorMark = JSON.parse(JSON.stringify(data))



                data = await query('SELECT number, class_name, professor FROM class')
                const allClass = JSON.parse(JSON.stringify(data))

                // 透過課程名稱更新
                let length = getWebMark.length
                console.log(length)
                for(let num = 0; num < length; num++){
                    for(let i = 0; i< allClass.length; i++){

                        if(allClass[i].class_name.trim() == getWebMark[num].class_name.trim()){

                            if(allClass[i].mark){
                                allClass[i].mark += +getWebMark[num].mark
                            }else{
                                allClass[i].mark = +getWebMark[num].mark
                                calculation.push(i)
                            }

                            if(allClass[i].time){
                                allClass[i].time++
                            }else{
                                allClass[i].time = 1
                            }
                            break
                        }

                    }
                }

                //檢查目前run的狀況
                let checkPoint = await getNowStatus()
                if(!+checkPoint){
                    console.log('從外部被關閉')
                    return
                }

                // 透過教授
                length = getProfessorMark.length

                console.log(length)

                for(let num = 0; num < length; num++){
                    for(let i = 0; i< allClass.length; i++){

                        if(allClass[i].professor.trim() == getProfessorMark[num].professor.trim()){

                            if(allClass[i].mark){
                                allClass[i].mark += +getProfessorMark[num].mark
                            }else{
                                allClass[i].mark = +getProfessorMark[num].mark
                                calculation.push(i)
                            }

                            if(allClass[i].time){
                                allClass[i].time++
                            }else{
                                allClass[i].time = 1
                            }
                            break
                        }

                    }
                }

                //檢查目前run的狀況
                checkPoint = await getNowStatus()
                if(!+checkPoint){
                    console.log('從外部被關閉')
                    return
                }


                // 透過Class_number
                length = getAccountMark.length

                for(let num = 0; num < length; num++){
                    for(let i = 0; i< allClass.length; i++){

                        // console.log(allClass[i].class_name + ' and ' + getWebMark[num].class_name)
                        // console.log(i)
                        // console.log(allClass[i].class_name === getWebMark[num].class_name + '\n\n')
                        
                        if(allClass[i].number.trim() == getAccountMark[num].class_number.trim()){

                            if(allClass[i].mark){
                                allClass[i].mark += +getAccountMark[num].mark
                            }else{
                                allClass[i].mark = +getAccountMark[num].mark
                                calculation.push(i)
                            }

                            if(allClass[i].time){
                                allClass[i].time++
                            }else{
                                allClass[i].time = 1
                            }
                            break
                        }

                    }
                }

                //檢查目前run的狀況
                checkPoint = await getNowStatus()
                if(!+checkPoint){
                    console.log('從外部被關閉')
                    return
                }
                

                for(let num=0; num < calculation.length; num++){
                    const updata =  calculation[num]
                    allClass[updata].mark = allClass[updata].mark / allClass[updata].time

                    if(allClass[updata].mark > 5){
                        allClass[updata].mark = 5
                    }
                    allClass[updata].mark = allClass[updata].mark.toFixed(1)
                    const packae = [allClass[updata].mark, allClass[updata].number]
                    let sql = "UPDATE class SET mark = ? WHERE number = ?"
                    await query(sql, packae)

                    if(num % 3 === 0){
                        //檢查目前run的狀況
                        checkPoint = await getNowStatus()
                        if(!+checkPoint){
                            console.log('從外部被關閉')
                            return
                        }
                    }
                }

                console.log('目前結束了')

                // 告訴DB，此事件已完成
                let setTime = "UPDATE `pangtingder`.`auto_work` SET `time` = ?, `run` = 0 WHERE (`work` = 'fixrating');"
                await query(setTime, nowTime)

                console.log('end')
                return
                
            }else{
                console.log("Time's not ready or Not admin")
                return
            }

        }else{
            console.log('事件正在執行')
            return
        }
        
    }else{
        console.log('rating功能 狀態為null')
        return
    }

}

module.exports = {
  upDataRating
}