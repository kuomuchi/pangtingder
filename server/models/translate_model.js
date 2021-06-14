const { 
    translateText
} = require('./recommend_model')


const { query } = require('./mysql_model')

const translteModel = async () => {
    
    let getAutoStatus = await query("SELECT time, status, run FROM pangtingder.auto_work WHERE work = 'translate'")
    const getRun = JSON.parse(JSON.stringify(getAutoStatus))[0].run
    const getStatus = JSON.parse(JSON.stringify(getAutoStatus))[0].status

    console.log(getRun)

    // 確認狀態
    if(getStatus){
        // 確認是否有再跑
        if(!+getRun){

            // 設定 run 為 1
            await query("UPDATE pangtingder.auto_work SET run = 1 WHERE (work = 'translate')")

            async function getNowStatus(){
                let data = await query("SELECT run FROM pangtingder.auto_work WHERE work = 'translate'")
                data = JSON.parse(JSON.stringify(data))
                return data[0].run
            }

            // 更新時間
            let nowTime = new Date().toLocaleString('zh-TW');
            let setTime = "UPDATE `pangtingder`.`auto_work` SET `time` = ? WHERE (`work` = 'translate');"
            await query(setTime, nowTime)

            const getClass = await query('SELECT id, class_content, content_translate FROM pangtingder.class WHERE content_translate IS NULL')
            const sortData = JSON.parse(JSON.stringify(getClass))
            const max = sortData.length
            console.log(max)

            let timesRun = 0;

            // 遞迴，處理function。
            async function main(){
                console.log('現在是:' + sortData[timesRun].id)

                //判斷，run狀態是否為 1
                if(timesRun % 5 === 0){
                    let checkPoint = await getNowStatus()
                    if(!+checkPoint){
                        console.log('從外部被關閉')
                        return
                    }
                }

                // 如果還沒有被翻譯過，加入DB
                if(!sortData[timesRun].content_translate && sortData[timesRun].class_content){

                    // 翻譯
                    const resutl = await translateText(sortData[timesRun].class_content)

                    // 如果翻譯爆掉
                    if(resutl === 0 || resutl === undefined){
                        console.log('壞掉 ' + sortData[timesRun].id)
                        console.log('google-Api爆氣')

                        const msg = '壞掉 ' + sortData[timesRun].id
                        await query("UPDATE `pangtingder`.`auto_work` SET `msg` = ?, run = 0 WHERE (`work` = 'translate');", msg)
                        return

                    }else{
                        // 翻譯成功加入DB
                        let sql = "UPDATE pangtingder.class SET `content_translate` = ? WHERE (id = ?)"
                        const data = [resutl, sortData[timesRun].id]
                        await query(sql, data)

                        // 等待1.5秒之後，在call這個function一次
                        timesRun++
                        setTimeout( ()=> {
                            main()
                        }, 1500)
                    }
                    
                }else{
                    console.log('這裡不需要翻譯')
                    timesRun++
                    setTimeout( () => {
                        main()
                    }, 100)
                }
                
                if(timesRun >= max){
                    await query("UPDATE pangtingder.auto_work SET run = 0 WHERE (work = 'translate')")
                    console.log('end，全部翻譯完')
                    return
                }

            }

            main()

        }else{
            console.log("事件正在執行")
            return
        }
    }else{
        console.log('translate功能 狀態為null')
        return
    }

}

module.exports = {
    translteModel
}