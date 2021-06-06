const { 
    getRecommend,
    translateText
} = require('../models/recommend_model')

const { query } = require('../models/mysql_model')

const translte = async (req, res) => {
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
                setTimeout( ()=> {
                    main()
                }, 3600000)
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
        
        if(timesRun === max){
            return res.send('finish')
        }

    }

    main()

}





const recommend = async (req, res) => {

    const getClass = await query('SELECT number, class_name, content_translate FROM pangtingder.class WHERE content_translate IS NOT NULL')
    let data = JSON.parse(JSON.stringify(getClass))

    console.log('max: ' + data.length)


    const insertDB = []

    

    const classNumber = []
    const recommend = []
    const similar = []

    let oldData =  await query('SELECT id FROM pangtingder.recommend')
    oldData = oldData.length / 10

    for(let i= oldData ; i<data.length; i++){

        console.log('now ' + i)

        const self = data[i].content_translate


        const package = []
        const rec = []
        const sim = []

        if(self.length > 30){

            for(let u=0; u<data.length; u++){
                if(u !== i){
                        
                    const other = data[u].content_translate
                    const result = await getRecommend(self, other)          
                    
                    rec.push(data[u].number)
                    sim.push(+result)
                }

            }


            for(index = 0; index < 10; index++){
                let place = -1
                let max = 0;
                for(let num = 0; num < sim.length; num++){
                    if(+sim[num] > max){
                        max = +sim[num]
                        place = num;
                    }
                }

                // 整理確認好看用的
                let replace = {
                    number: data[i].number,
                    rec: rec[place],
                    sim: sim[place]
                }

                insertDB.push(replace)


                // 要加入DB的資料
                classNumber.push(data[i].number)
                recommend.push(rec[place])
                similar.push(sim[place])

                package.push([data[i].number, rec[place], sim[place]])

                // 重新整理
                rec[place] = 0
                sim[place] = 0

            }

            let sql = 'INSERT INTO pangtingder.recommend (number, recommend, similar) VALUES ?'
            await query(sql, [package]).catch(err => console.log(err))


            console.log('next')
            
        }else{
            console.log('skip')
        }

    }

    // console.log(classNumber.length)
    // console.log(recommend.length)
    // console.log(similar.length)

    // await query('TRUNCATE TABLE pangtingder.recommend')

    res.send('finish')
}

module.exports = {
    recommend,
    translte
}