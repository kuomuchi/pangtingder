console.log('js')

let account_token = ''
let deleteCollectArray = []

if(!window.localStorage.getItem('account_token')){
    window.location.href ="/login.html"
}else{
    account_token = window.localStorage.getItem('account_token')
}


// 登出按鈕被按下
document.querySelector('.logout_button').addEventListener('click', (event) => {
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
    collect.style.backgroundColor = 'var(--color-1)'
    recommend.style.backgroundColor = 'var(--color-1-hover)'

    collectBox.style.display = 'flex'
    recommendBox.style.display = 'none'

})


recommend.addEventListener('click', () =>{
    collect.style.backgroundColor = 'var(--color-1-hover)'
    recommend.style.backgroundColor = 'var(--color-1)'

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
        }else if(getData.data[0].root === 'admin'){
            console.log('yes')
            document.querySelectorAll('.admin_service')[0].href = '/admin_service.html'

            document.querySelectorAll('.admin_edit')[0].classList.remove('user')
            document.querySelectorAll('.admin_edit_account')[0].classList.remove('user')
            

        }else{
            document.querySelectorAll('.admin_service')[0].href = '/service.html'
        }


        // 把用戶的收藏全部顯示出來
        getUserCollect = getData.data[1]
        getData = getData.data[0]
        console.log(getData)

        let isCollert = 0

        if(getUserCollect){
            isCollert = getUserCollect.length
        }else{
            isCollert = 0
        }


        for(let num=0; num < isCollert; num++){
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

            outElemant = document.getElementsByClassName('class')[num]
            addnewChild = document.createElement('div')
            addnewChild.classList.add('class_item')  
            addnewChild.classList.add('class_remove')
            addnewChild.textContent = '⊗'
            addnewChild.style.fontSize = '30px'

            // 刪除收藏
            addnewChild.addEventListener('click', (event)=>{
                event.preventDefault()
                const deleteNumber = event.path[1].children[0].textContent
                deleteCollectArray.push(deleteNumber)
                event.path[1].remove()
            })

            outElemant.appendChild(addnewChild)


        }


        
        // 如果有登入，頭線的href 位置。
        if(getData.msg){
            window.localStorage.removeItem('account_token')
            window.location.href ="/login.html"
        }else{
            document.getElementsByClassName('user_name')[0].textContent = getData.name
        }

    }
}

xhr.send()



window.onbeforeunload =  () => {

    if(deleteCollectArray.length){
        const dCollectReuqest = new XMLHttpRequest()
        dCollectReuqest.open('DELETE', '/collect', true)
        dCollectReuqest.setRequestHeader("authorization", 'Bearer ' + account_token);
        dCollectReuqest.setRequestHeader("Content-Type", "application/json");
        const collect = {
            collect: deleteCollectArray
        }
        dCollectReuqest.send(JSON.stringify(collect))
    }

    deleteCollectArray = []

}