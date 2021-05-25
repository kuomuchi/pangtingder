console.log('js')

let account_token = ''

if(!window.localStorage.getItem('account_token')){
    window.location.href ="/login.html"
}else{
    account_token = window.localStorage.getItem('account_token')
}


// 登出按鈕被按下
document.querySelector('.logout > p').addEventListener('click', (event) => {
    window.localStorage.removeItem('account_token')
    alert('登出成功')
    window.location.href = '/'
})



//切換推薦與收藏
const collect = document.getElementsByClassName('change_collect')[0]
const recommend = document.getElementsByClassName('change_recommend')[0]

const collectBox = document.getElementsByClassName('collect_box')[0]
const recommendBox = document.getElementsByClassName('recommend_box')[0]

collect.addEventListener('click', () =>{
    collect.style.backgroundColor = '#ccc'
    recommend.style.backgroundColor = '#aaa'

    collectBox.style.display = 'flex'
    recommendBox.style.display = 'none'

})


recommend.addEventListener('click', () =>{
    collect.style.backgroundColor = '#aaa';
    recommend.style.backgroundColor = '#ccc';

    collectBox.style.display = 'none'
    recommendBox.style.display = 'flex'
})



// 抓取玩家資料 jwt token
const xhr = new XMLHttpRequest()
xhr.open('GET', '/profile', true)
xhr.setRequestHeader("authorization", 'Bearer ' + account_token);

xhr.onreadystatechange = function () {
    if(xhr.readyState == 4 && xhr.status == 200){
        let getData = "";
        getData = xhr.responseText;
        getData = JSON.parse(getData)
        console.log(getData)

        if(getData.data.msg === 'false'){
            window.localStorage.removeItem('account_token')
            alert('請重新登入')
            window.location.href = '/login.html'
            return
        }


        // 把用戶的收藏全部顯示出來
        getUserCollect = getData.data[1]
        getData = getData.data[0]
        console.log(getData)

        console.log(getUserCollect)


        for(let num=0; num < getUserCollect.length; num++){
            // 創造一個新的課程
            let outElemant = document.getElementsByClassName('class_box_item')[0]
            let addnewChild = document.createElement('a')
            addnewChild.classList.add('class')
            addnewChild.href = './detail.html?'+getUserCollect[num].number
            addnewChild.target = "_blank"
            outElemant.appendChild(addnewChild)

            //放入課程的內容-課程代碼
            outElemant = document.getElementsByClassName('class')[num]
            addnewChild = document.createElement('div')
            addnewChild.classList.add('class_item') 
            addnewChild.classList.add('class_num')
            addnewChild.textContent = getUserCollect[num].number
            outElemant.appendChild(addnewChild)


            //放入課程的內容-課程名稱
            outElemant = document.getElementsByClassName('class')[num]
            addnewChild = document.createElement('div')
            addnewChild.classList.add('class_item') 
            addnewChild.classList.add('class_name')
            addnewChild.textContent = getUserCollect[num].class_name
            outElemant.appendChild(addnewChild)

            //放入課程的內容-科系
            outElemant = document.getElementsByClassName('class')[num]
            addnewChild = document.createElement('div')
            addnewChild.classList.add('class_item') 
            if(getUserCollect[num].department.trim()){
                addnewChild.textContent = getUserCollect[num].department
            }else{
                addnewChild.textContent = '所有'
            }
            outElemant.appendChild(addnewChild)

            //放入課程的內容-教授姓名
            outElemant = document.getElementsByClassName('class')[num]
            addnewChild = document.createElement('div')
            addnewChild.classList.add('class_item') 
            addnewChild.textContent = getUserCollect[num].professor
            outElemant.appendChild(addnewChild)

            //放入課程的內容-課程來源
            outElemant = document.getElementsByClassName('class')[num]
            addnewChild = document.createElement('div')
            addnewChild.classList.add('class_item') 
            addnewChild.textContent = getUserCollect[num].source
            outElemant.appendChild(addnewChild)

            //放入課程的內容-課程分數
            outElemant = document.getElementsByClassName('class')[num]
            addnewChild = document.createElement('div')
            addnewChild.classList.add('class_item')  
            addnewChild.classList.add('class_mark')
            if( getUserCollect[num].mark !== null){
                addnewChild.textContent = getUserCollect[num].mark
            }else{
                addnewChild.textContent = '~'
            }
            
            outElemant.appendChild(addnewChild)


        }









        
        
        

        if(getData.msg){
            window.localStorage.removeItem('account_token')
            window.location.href ="/login.html"
        }else{
            document.getElementsByClassName('user_name')[0].textContent = getData.name
        }

    }
}

xhr.send()