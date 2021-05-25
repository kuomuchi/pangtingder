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


document.getElementsByClassName('select_button')[0].addEventListener('click', () => {

    const haveClass = document.getElementsByClassName('class').length
    nowSelect.popular = document.getElementById('popular_select').value
    nowSelect.source = document.getElementById('source_select').value
    nowSelect.keyword = document.getElementById('keyword').value
    // console.log(nowSelect)
    nowpage = 0
    removeAllClass()
    getNextPage(nowpage)

    alert('hi')
    
})


const word = ['長大是一瞬間的', '發大財很棒', '活到老、學到老','冰鳥還敢下來啊！']
const oldElement = document.querySelector('#inspirational_quotes_box > h1')


//背景文字切換
setInterval(()=>{
    
    oldElement.style.opacity = 0.1;
    oldElement.remove()
    
    const outElement = document.getElementById('inspirational_quotes_box')
    const newChlid = document.createElement('h1')
    const randomnum = Math.floor(Math.random() * 5)
    newChlid.textContent = word[randomnum]
    setTimeout(() => {
        newChlid.style.opacity = 0.1;
    }, 9000)
    setTimeout( ()=>{
        newChlid.remove()
    }, 9900)
    outElement.appendChild(newChlid)
},10000)


// 上一頁
document.getElementById('previous').addEventListener('click', () => {
    const haveClass = document.getElementsByClassName('class').length

    if(nowpage === 0){
        alert('到底？')
    }else if(haveClass){
        removeAllClass()
        document.getElementsByClassName('now_Page')[0].textContent = nowpage
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
        document.getElementsByClassName('now_Page')[0].textContent = nowpage +1
        getNextPage(nowpage)
    }else{
        alert('你按太快了！慢慢來，溫柔一點')
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

    xhr.open('POST', `/learnpage/${num}`, true)
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            const data = xhr.responseText
            const objData = JSON.parse(data)
            // console.log(objData)

            getMaxPage = objData[10].maxpage

            for(let num=0; num < objData.length -1; num++){
                // 創造一個新的課程
                let outElemant = document.getElementsByClassName('class_box_item')[0]
                let addnewChild = document.createElement('a')
                addnewChild.classList.add('class')
                addnewChild.href = './detail.html?'+objData[num].number
                addnewChild.target = "_blank"
                outElemant.appendChild(addnewChild)

                //放入課程的內容-課程代碼
                outElemant = document.getElementsByClassName('class')[num]
                addnewChild = document.createElement('div')
                addnewChild.classList.add('class_item') 
                addnewChild.classList.add('class_num')
                addnewChild.textContent = objData[num].number
                outElemant.appendChild(addnewChild)


                //放入課程的內容-課程名稱
                outElemant = document.getElementsByClassName('class')[num]
                addnewChild = document.createElement('div')
                addnewChild.classList.add('class_item') 
                addnewChild.classList.add('class_name')
                addnewChild.textContent = objData[num].class_name
                outElemant.appendChild(addnewChild)

                //放入課程的內容-科系
                outElemant = document.getElementsByClassName('class')[num]
                addnewChild = document.createElement('div')
                addnewChild.classList.add('class_item') 
                if(objData[num].department.trim()){
                    addnewChild.textContent = objData[num].department
                }else{
                    addnewChild.textContent = '所有'
                }
                outElemant.appendChild(addnewChild)

                //放入課程的內容-教授姓名
                outElemant = document.getElementsByClassName('class')[num]
                addnewChild = document.createElement('div')
                addnewChild.classList.add('class_item') 
                addnewChild.textContent = objData[num].professor
                outElemant.appendChild(addnewChild)

                //放入課程的內容-課程來源
                outElemant = document.getElementsByClassName('class')[num]
                addnewChild = document.createElement('div')
                addnewChild.classList.add('class_item') 
                addnewChild.textContent = objData[num].source
                outElemant.appendChild(addnewChild)

                //放入課程的內容-課程分數
                outElemant = document.getElementsByClassName('class')[num]
                addnewChild = document.createElement('div')
                addnewChild.classList.add('class_item')  
                addnewChild.classList.add('class_mark')
                if( objData[num].mark !== null){
                    addnewChild.textContent = objData[num].mark
                }else{
                    addnewChild.textContent = '~'
                }
                
                outElemant.appendChild(addnewChild)

            }
            
        }
    }


    xhr.send(JSON.stringify(nowSelect))

}

