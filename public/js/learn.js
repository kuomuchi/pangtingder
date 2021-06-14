if(!window.localStorage.getItem('account_token')){
    document.getElementsByClassName('top_login')[0].style.display = ''
    document.getElementsByClassName('top_login_icon')[0].style.display = 'none'

    document.querySelectorAll('.top_box_right > a')[1].href = './login.html'
  }else{
    document.getElementsByClassName('top_login')[0].style.display = 'none'
    document.getElementsByClassName('top_login_icon')[0].style.display = ''

    document.querySelectorAll('.top_box_right > a')[1].href = './profile.html'
}


// 搜尋用的
const nowSelect = {
    popular: document.getElementById('popular_select').value,
    source: document.getElementById('source_select').value,
    keyword: document.getElementById('keyword').value
}

let nowpage = 0
let getMaxPage = 9990


// 第一頁
getNextPage(nowpage)

// 爆搜
document.getElementById('keyword').addEventListener('keyup', (event) => {
    if(event.code === 'Enter'){
        sendingData()
    }
})

// 更改selecter
document.getElementById('popular_select').addEventListener('change', (event) => {

    const haveClass = document.getElementsByClassName('class').length
    if(haveClass){
        sendingData()        
    }

})

document.getElementById('source_select').addEventListener('change', (event) => {

    const haveClass = document.getElementsByClassName('class').length
    if(haveClass){
        sendingData()        
    }

})


const word = ['長大是一瞬間的', '發大財很棒', '活到老、學到老','冰鳥還敢下來啊！', '寧願辛苦一陣子，不要辛苦一輩子', '人生最大的敵人是自己怯懦', '健康的身體是實現目標的基石', '沒有退路時，潛能就發揮出來了', '你不一定要很厲害，才能開始；但你要開始，才能很厲害', '永不言敗，是成功者的最佳品格', '要成功，先發瘋，頭腦簡單向前衝', '擁有夢想只是一種智力，實現夢想才是一種能力']


//背景文字切換
setInterval(()=>{
    const wordElement = document.getElementsByClassName('iq_text')[0]
    wordElement.classList.remove('iq_text_delete')
    randomNum = Math.floor(Math.random()* word.length)

    wordElement.textContent = word[randomNum]

    setTimeout(() =>{
        wordElement.classList.add('iq_text_delete')
    }, 4000)
    
},5000)


// 上一頁
document.getElementById('previous').addEventListener('click', () => {
    const haveClass = document.getElementsByClassName('class').length

    if(nowpage === 0){
        alert('到底？')
    }else if(haveClass){
        removeAllClass()
        document.getElementsByClassName('now_Page')[0].value = nowpage
        nowpage--
        getNextPage(nowpage)
    }else{
        alert('你按太快了！慢慢來，溫柔一點')
    }
})

// 下一頁
document.getElementById('next').addEventListener('click', () => {

    const haveClass = document.getElementsByClassName('class').length
    if(nowpage >= (getMaxPage / 10) - 1){
        alert('到底？')
    }else if(haveClass){
        removeAllClass()
        nowpage++
        document.getElementsByClassName('now_Page')[0].value = nowpage +1
        getNextPage(nowpage)
    }else{
        alert('你按太快了！慢慢來，溫柔一點')
    }

})

document.getElementsByClassName('now_Page')[0].addEventListener('keyup', (event) => {
    if(event.code === 'Enter'){
        const getPage = document.getElementsByClassName('now_Page')[0].value

        if(!isNaN(getPage)){

            if(+getPage - 1 >= 0){
                removeAllClass()
                nowpage = +getPage - 1
                getNextPage(nowpage)
            }
            
        }

    }
})


function removeAllClass(){
    const getAllClass = document.getElementsByClassName('class')
    const maxnum = getAllClass.length
    for(let num = 0; num < maxnum; num++){
        getAllClass[0].remove()
    }
}



function getNextPage(num){
    const xhr = new XMLHttpRequest()

    // 這裡讓貓咪出現
    document.getElementsByClassName('loading')[0].classList.remove('nano')
    document.getElementsByClassName('loading')[0].src = './images/catloading.gif'

    xhr.open('POST', `/learnpage/${num}`, true)
    xhr.setRequestHeader("Content-Type", "application/json");

    // 抓到資料後
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            const data = xhr.responseText
            const objData = JSON.parse(data)
            // console.log(objData)

            const num = objData.length - 1
            getMaxPage = objData[num].maxpage

            // 貓咪消失
            if(objData.length === 1){
                document.getElementsByClassName('loading')[0].src = './images/recommend404.png'
            }else{
                document.getElementsByClassName('loading')[0].classList.add('nano')
            }

            for(let num=0; num < objData.length -1; num++){
                // 創造一個新的課程
                let outElemant = document.getElementsByClassName('class_box_item')[0]
                let addnewChild = document.createElement('a')
                addnewChild.classList.add('class')
                addnewChild.href = './detail.html?'+objData[num].number
                addnewChild.target = "_blank"
                outElemant.appendChild(addnewChild)


                // 創建圖片的div
                outElemant = document.getElementsByClassName('class')[num]
                addnewChild = document.createElement('div')
                addnewChild.classList.add('class_image') 
                outElemant.appendChild(addnewChild)

                // 創建圖片本人
                outElemant = document.getElementsByClassName('class_image')[num]
                addnewChild = document.createElement('img')
                if(objData[num].image){
                    addnewChild.src = objData[num].image
                }else{
                    addnewChild.src = './images/noImage.png'
                }
                outElemant.appendChild(addnewChild)

                // 包住課程資訊的 div
                outElemant = document.getElementsByClassName('class')[num]
                addnewChild = document.createElement('div')
                addnewChild.classList.add('class_text') 
                outElemant.appendChild(addnewChild)


                //放入課程的內容-課程名稱
                outElemant = document.getElementsByClassName('class_text')[num]
                addnewChild = document.createElement('div')
                addnewChild.classList.add('class_item') 
                addnewChild.classList.add('class_name')
                let text = objData[num].class_name.trim()
                if(objData[num].class_name.length > 11){
                    addnewChild.style.fontSize = '20px'
                    text = text.substr(0, 10)
                    text += '...'
                }else if(objData[num].class_name.length > 8){
                    addnewChild.style.fontSize = '20px'
                }
                addnewChild.textContent = text
                outElemant.appendChild(addnewChild)


                //放入課程的內容-課程代碼
                outElemant = document.getElementsByClassName('class_text')[num]
                addnewChild = document.createElement('div')
                addnewChild.classList.add('class_item') 
                addnewChild.classList.add('class_num')
                addnewChild.textContent = objData[num].number
                outElemant.appendChild(addnewChild)


                //放入課程的內容-教授姓名
                outElemant = document.getElementsByClassName('class_text')[num]
                addnewChild = document.createElement('div')
                addnewChild.classList.add('class_item') 
                addnewChild.textContent = objData[num].professor
                outElemant.appendChild(addnewChild)

                //放入課程的內容-科系
                outElemant = document.getElementsByClassName('class_text')[num]
                addnewChild = document.createElement('div')
                addnewChild.classList.add('class_item') 
                if(objData[num].department.trim()){
                    addnewChild.textContent = '對象: ' + objData[num].department
                }else{
                    addnewChild.textContent = '對象: 所有'
                }
                outElemant.appendChild(addnewChild)

                //放入課程的內容-課程來源
                outElemant = document.getElementsByClassName('class_text')[num]
                addnewChild = document.createElement('div')
                addnewChild.classList.add('class_item') 
                addnewChild.textContent = '來源: ' + objData[num].source
                outElemant.appendChild(addnewChild)

                //放入課程的內容-課程分數
                outElemant = document.getElementsByClassName('class_text')[num]
                addnewChild = document.createElement('div')
                addnewChild.classList.add('class_item')  
                addnewChild.classList.add('class_mark')
                if( objData[num].mark !== null){
                    addnewChild.textContent = '評分: ' + objData[num].mark
                }else{
                    addnewChild.textContent = '評分: ~'
                }
                
                outElemant.appendChild(addnewChild)

            }
            
        }
    }


    xhr.send(JSON.stringify(nowSelect))

}


const sendingData = () => {
    const haveClass = document.getElementsByClassName('class').length
    nowSelect.popular = document.getElementById('popular_select').value
    nowSelect.source = document.getElementById('source_select').value
    nowSelect.keyword = document.getElementById('keyword').value
    // console.log(nowSelect)
    nowpage = 0
    removeAllClass()
    getNextPage(nowpage)
    document.getElementsByClassName('now_Page')[0].textContent = '1'
}