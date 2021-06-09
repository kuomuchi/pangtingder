const { 
    translateText
} = require('./recommend_model')

const { query } = require('./mysql_model')

const translte = async () => {
    const getClass = await query('SELECT id, class_content, content_translate FROM pangtingder.class WHERE content_translate IS NULL')
    const sortData = JSON.parse(JSON.stringify(getClass))
    const max = sortData.length
    console.log(max)

    let timesRun = 0;

    async function main(){
        console.log('現在是:' + sortData[timesRun].id)
        // 如果還沒有被翻譯過，加入DB
        if(!sortData[timesRun].content_translate && sortData[timesRun].class_content){

            // 翻譯
            const resutl = await translateText(sortData[timesRun].class_content)

            // 如果翻譯爆掉
            if(resutl === 0 || resutl === undefined){
                console.log('壞掉 ' + sortData[timesRun].id)
                console.log('google-Api爆氣')
                return

            }else{
                // 加入DB
                let sql = "UPDATE pangtingder.class SET `content_translate` = ? WHERE (id = ?)"
                const data = [resutl, sortData[timesRun].id]
                await query(sql, data)
                console.log(resutl)
                // 等待8秒之後，在call這個function一次
                timesRun++
                setTimeout( ()=> {
                    main()
                }, 8000)
            }
            
        }else{
            console.log('這裡不需要翻譯')
            timesRun++
            setTimeout( () => {
                main()
            }, 100)
        }
        
        if(timesRun >= max){
            console.log('end')
            return
        }

    }

    main()

}

module.exports = {
    translte
}