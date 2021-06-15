const { query } = require('../models/mysql_model')

const fixWebModel = async () => {
    const getDB = await query("SELECT time, status, run FROM pangtingder.auto_work WHERE work = 'fixweb'")
    const getStatus = JSON.parse(JSON.stringify(getDB))[0].status
    const getRun = JSON.parse(JSON.stringify(getDB))[0].run

    if(getStatus){
        if(!+getRun){

            // 開始執行
            await query("UPDATE pangtingder.auto_work SET run = 1 WHERE (work = 'fixweb')")

            // 更新時間
            let nowTime = new Date().toLocaleString('zh-TW');
            let setTime = "UPDATE `pangtingder`.`auto_work` SET `time` = ? WHERE (`work` = 'fixweb');"
            await query(setTime, nowTime)

            // 判斷事件 run狀態
            async function getNowStatus(){
                let data = await query("SELECT run FROM pangtingder.auto_work WHERE work = 'fixweb'")
                data = JSON.parse(JSON.stringify(data))
                return data[0].run
            }

            // 將重複的課程刪除。
            
            const getPluralClass = await query("SELECT number ,count(number) as 'num' FROM pangtingder.class group by number;")
            const data = JSON.parse(JSON.stringify(getPluralClass))
            const bugData = []

            for(let i = 0; i< data.length; i++){
                // 如果有重複的課程
                if(+data[i].num >= 2){
                    bugData.push(data[i].number)
                }
            }

            // console.log(bugData)

            let msg = ''
            
            // 如果有任何重複的課程
            if(bugData.length){

                msg = '清除重複課程'

                // 查詢所有有問題的課程
                let butClass = await query("SELECT id, number FROM pangtingder.class WHERE number in (?)", [bugData])
                butClass = JSON.parse(JSON.stringify(butClass))


                let nowNumber = 0
                const deleteId = [] //等待刪除名單

                for(let i=0; i< butClass.length; i++){

                    // 將正常的課程給剔除
                    if(bugData[nowNumber] === butClass[i].number){
                        nowNumber++
                        butClass[i] = undefined
                    }else{
                        // 將其餘的課程加入帶刪除名單
                        deleteId.push(butClass[i].id)
                    }
                }

                // 刪除課程
                await query("DELETE FROM pangtingder.class WHERE id in (?)", [deleteId])


            }else{
                msg = '目前沒有問題'

            }


            await query("UPDATE pangtingder.auto_work SET run = 0, msg = ? WHERE (work = 'fixweb')", msg)

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