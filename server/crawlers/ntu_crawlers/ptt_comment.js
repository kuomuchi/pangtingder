const fetch = require('node-fetch')
const cheerio = require('cheerio');
const { query } = require('../../models/mysql_model.js')



const allData = [] // 儲存所有完整的資料
const sendData = []


async function main(){
    let getNum = 0;

    try {
        const res = await fetch('https://www.ptt.cc/bbs/NTUcourse/search?page=1&q=%5B%E8%A9%95%E5%83%B9%5D')
        const html = await res.text()
        const $ = cheerio.load(html)
        const arr = [] // 儲存Title
        // 抓取 Title
        $("div.r-ent div.title").each((ind, title) => {
            arr[ind] = $(title).text().trim().split(' ')
        })

        // 進入Title 抓取星星數
        // 先抓取ptt Title的 url
        $("div.r-ent div.title a").each((ind, link) => {
            //將其url組裝起來！
            let url = 'https://www.ptt.cc'+ $(link).attr('href')

            // 回傳結果「data」為該評論的星星數量。
            getStart(url).then( data => {
                getNum++
                let wait = ''

                // 如果資料格式不對，就跳過！
                if(arr[ind][2] === undefined || arr[ind][3] === undefined || arr[ind][2].length === 1 || arr[ind][3].length === 1 || data === undefined || data === 'dont' || !arr[ind][2].trim().length || !arr[ind][3].trim().length){
                    console.log('skip')
                }else{
                    // 如果資料格式可被修正，就修改。
                    if(arr[ind][2].length === 3 && (arr[ind][3].length > 3 || arr[ind][3].length <= 2)){
                        wait = arr[ind][3]
                        arr[ind][3] = arr[ind][2]
                        arr[ind][2] = wait
                    }

                    if(isNaN(+arr[ind][2].substr(0, 1)) && isNaN(+arr[ind][3].substr(0, 1))){

                        // 將資料打包
                        const package = {
                            web:'ptt',
                            class_name: arr[ind][2],
                            professor: arr[ind][3],
                            start: data,
                            source: '台大'
                        }

                        // 把資料weee 入MySQL，特別的包裝方法:D
                        const sqlPackae = []
                        sqlPackae.push(package.web)
                        sqlPackae.push(package.class_name)
                        sqlPackae.push(package.professor)
                        sqlPackae.push(package.start)
                        sqlPackae.push(package.source)
                        //存入array裡
                        allData.push(package)
                        sendData.push(sqlPackae)
                    }else{
                        // 當資料出錯
                        console.log("一定把你鼻樑打斷！")
                    }
                }
                // 前往下一頁抓資料
                if(getNum === arr.length){
                    allp()
                }
            })
        })

        function allp(){
            // 抓取下一頁的url
            $("div.btn-group.btn-group-paging a.btn.wide").each((ind, link) =>{
                let url = ''
                // 抓取「下一頁」的按鈕位置
                url = $(link).attr('href')
                console.log(ind)
                console.log(url)

                console.log()
                if(ind === 1){

                    // 如果有下一頁，就遞迴。
                    if(url !== undefined){
                        // console.log('遞迴開始！')
                        main('https://www.ptt.cc' + url)
                        // 否則高歌離席
                    }else{
                        // 已經到底了，將所有資料 print 出來
                        console.log('高歌離席！')
                        console.log(allData)

                        //   將資料加入:D
                        // const sql = 'INSERT INTO web_comment (web, class_name, professor, mark, source) VALUES ?'
                        // query(sql, [sendData], (err, result) => {
                        //     if (err) throw err
                        //     console.log(result)
                        // })

                        return 
                    }
                }
                
            })
            
        }

        
    } catch (error) {
        console.log(error)
        console.log('error')
    }
}


async function getStart(url){
    try {
        const body = await fetch(url)
        const start = await body.text()
        const _ = cheerio.load(start)
        let reSend = ''
        _("body div#main-container div.bbs-screen.bbs-content span.f3.hl").each((a, b) => {
            const sortData = _(b).text()
            if(sortData.trim().substr(0, 1) === '★'){
                reSend = sortData.trim()
                // console.log(sortData.trim())
            }
        })
        if(reSend == ''){
            return "dont"
        }else{
            reSend = reSend.trim()
            let point = 0
            for(let num = 0; num < reSend.length; num++){
                // console.log(eSend.substr(num, 0))
                if(reSend.substr(num, 1) === '★'){
                    point++
                }
            }
            return point
        }

    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    main
  }