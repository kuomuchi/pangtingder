const { query } = require('../models/mysql_model')

const { 
    starEvent
} = require('../../util/util')

const selectRepeatCourse = (data) => {
    const bugClassArray = []
    for(let i = 0; i< data.length; i++){

        if(+data[i].num >= 2){
            bugClassArray.push(data[i].number)
        }
    }
    return bugClassArray
}

const getDeleteClassId = (butClass) => {
                    
    let nowNumber = 0

    const courseId = []

    for(let i=0; i< butClass.length; i++){
        
        // clear normal course
        if(bugData[nowNumber] === butClass[i].number){
            nowNumber++
            butClass[i] = undefined
        }else{

            // push other course in array
            courseId.push(butClass[i].id)
        }
    }
    
    return courseId
    
}

const fixWebModel = async () => {
    
    const getDB = await query("SELECT time, status, run FROM auto_work WHERE work = 'fixweb'")
    const getStatus = JSON.parse(JSON.stringify(getDB))[0].status
    const getRun = JSON.parse(JSON.stringify(getDB))[0].run

    if(getStatus){
        if(!+getRun){

            starEvent('fixweb')         

            const getPluralClass = await query("SELECT number ,count(number) as 'num' FROM class group by number;")
            const data = JSON.parse(JSON.stringify(getPluralClass))
            const bugData = await selectRepeatCourse(data)


            let msg = ''
            
            // if select any repate coruse
            if(bugData.length){

                msg = '清除重複課程'

                // selest all repeat coruse id
                let butClass = await query("SELECT id, number FROM class WHERE number in (?)", [bugData])
                butClass = JSON.parse(JSON.stringify(butClass))

                // get all coruse id who are repeat
                const deleteId = await getDeleteClassId(butClass)
                
                // delete coruse
                await query("DELETE FROM class WHERE id in (?)", [deleteId])

            }else{
                msg = '目前沒有問題'

            }

            await query("UPDATE auto_work SET run = 0, msg = ? WHERE (work = 'fixweb')", msg)

            console.log('end')
            return

        }else{
            console.log('事件正在執行')
            return
        }

    }else{
        console.log('fixWeb功能 狀態為null')
        return
    }
}

module.exports = {
    fixWebModel
}