const { 
    getRecommend,
    translateText
} = require('../models/recommend_model')

const { query } = require('../models/mysql_model')

const translte = async (req, res) => {
    const getClass = await query('SELECT id, class_content, content_translte FROM pangtingder.class WHERE content_translte IS NULL')
    const sortData = JSON.parse(JSON.stringify(getClass))
    const max = sortData.length
    console.log(max)

    let timesRun = 0;

    async function main(){
        console.log('現在是:' + sortData[timesRun].id)
        // 如果還沒有被翻譯過，加入DB
        if(!sortData[timesRun].content_translte && sortData[timesRun].class_content){

            // 翻譯
            const resutl = await translateText(sortData[timesRun].class_content)

            // 如果翻譯爆掉
            if(resutl === 0 || resutl === undefined){
                console.log('壞掉 ' + sortData[timesRun].id)
                console.log('google-Api爆氣')
                setTimeout( ()=> {
                    main()
                }, 3600000)
            }else{
                // 加入DB
                let sql = "UPDATE pangtingder.class SET `content_translte` = ? WHERE (id = ?)"
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
        
        if(timesRun === max){
            return res.send('finish')
        }

    }

    main()

}





const recommend = async (req, res) => {
    const getClass = await query('SELECT class_name, class_content FROM pangtingder.class LIMIT 0, 10')

    let data = JSON.parse(JSON.stringify(getClass))

    for(let i=1; i<10; i++){
        // const isGreateContent = data[i].class_content
        // console.log(data[0].class_content)
        // console.log(data[i].class_content)
        const self = data[0].class_content
        const other = data[i].class_content

        try {
            const result = await getRecommend(self, other)
            console.log(data[0].class_name + ' and ' +data[i].class_name + ' = ' +result)    
        } catch (error) {
            console.log(error)
        }
        
        
        
        
        
    }
    res.send('finish')
}

module.exports = {
    recommend,
    translte
}