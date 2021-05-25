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

    let timesRun = 29;
    let interval = setInterval(async function (){

        console.log('現在是:' + sortData[timesRun].id)
        // 如果還沒有被翻譯過，加入DB
        if(!sortData[timesRun].content_translte && sortData[timesRun].class_content){

            // 翻譯
            const resutl = await translateText(sortData[timesRun].class_content)

            // 如果翻譯爆掉
            if(resutl === 0 || resutl === undefined){
                console.log('壞掉 ' + sortData[timesRun].id)
                clearInterval(interval);
                return res.send('google-Api爆氣')
            }else{
                // 加入DB
                let sql = "UPDATE pangtingder.class SET `content_translte` = ? WHERE (id = ?)"
                const data = [resutl, sortData[timesRun].id]
                await query(sql, data)
                console.log(resutl)
            }
            
        }

        timesRun++
        console.log(timesRun)
        
        if(timesRun === max){
            clearInterval(interval);
            return res.send('finish')
        }

    }, 10000);

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