const { query } = require('../models/mysql_model')

const upDataRating = async (admin) => {

    let getTime = await query("SELECT time FROM pangtingder.auto_work WHERE work = 'rating';")
    getTime = JSON.parse(JSON.stringify(getTime))[0].time
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

    if(admin || +getTime < +sortTime){

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

                    console.log('metch')
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

        // 透過教授
        length = getProfessorMark.length

        console.log(length)

        for(let num = 0; num < length; num++){
            for(let i = 0; i< allClass.length; i++){

                if(allClass[i].professor.trim() == getProfessorMark[num].professor.trim()){

                    console.log('metch')
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


        // 透過Class_number
        length = getAccountMark.length

        for(let num = 0; num < length; num++){
            for(let i = 0; i< allClass.length; i++){

                // console.log(allClass[i].class_name + ' and ' + getWebMark[num].class_name)
                // console.log(i)
                // console.log(allClass[i].class_name === getWebMark[num].class_name + '\n\n')
                
                if(allClass[i].number.trim() == getAccountMark[num].class_number.trim()){

                    console.log('asdfasdf')
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

        console.log(calculation)
        

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

        console.log(allClass[updata])
      }


    let setTime = "UPDATE `pangtingder`.`auto_work` SET `time` = ? WHERE (`work` = 'rating');"
    await query(setTime, nowTime)
    }

}

module.exports = {
  upDataRating
}