let clickStar = -1

// 查看是否有登入
const account_token = window.localStorage.getItem('account_token')
if(!window.localStorage.getItem('account_token')){
    document.getElementsByClassName('top_login')[0].style.display = ''
    document.getElementsByClassName('top_login_icon')[0].style.display = 'none'

    document.querySelectorAll('.top_box_right > a')[1].href = './login.html'
    document.getElementsByClassName('collect_button')[0].style.display = 'none'
  }else{
    document.getElementsByClassName('top_login')[0].style.display = 'none'
    document.getElementsByClassName('top_login_icon')[0].style.display = ''

    document.querySelectorAll('.top_box_right > a')[1].href = './profile.html'
    // document.getElementsByClassName('collect_button')[0].style.display = 'flex'
}


// 切字網頁的url
const queryParamsString = window.location.search.substr(1)
// console.log(queryParamsString)


//留言

const userInfo = []
document.getElementById('keyword').addEventListener('focus', () => {
    window.addEventListener('keyup', (event) => {
        const intputContent =  document.getElementById('keyword').value
        if(event.code === 'Enter' && intputContent.trim()){
            console.log('sendINg')
            document.getElementById('keyword').value = ''
            if(window.localStorage.getItem('account_token')){

                const UserData = {
                    class_number: queryParamsString,
                    msg: intputContent
                }

                // 把留言丟到DB
                const reqDetailMsg = new XMLHttpRequest()
                reqDetailMsg.open('POST', '/classMsg', true)
                reqDetailMsg.setRequestHeader("authorization", 'Bearer ' + account_token);
                reqDetailMsg.setRequestHeader("Content-Type", "application/json");

                let now = 0
                reqDetailMsg.onreadystatechange = function () {
                    const resend = reqDetailMsg.responseText

                    if(resend === 'false'){
                        window.localStorage.removeItem('account_token')
                        alert('登入逾時')

                    }else if(resend === 'ban'){
                        alert('被禁言了')
                        
                    }else if(resend === 'success' && now === 0){
                        now++
                        console.log('yes!')

                        let outElement = document.getElementsByClassName('message_area')[0]
                        let addnewChild = document.createElement('div')
                        addnewChild.classList.add('self_message')
                        outElement.appendChild(addnewChild)

                        // 抓取最後一個Element
                        outElement = document.getElementsByClassName('self_message')
                        let stack = outElement.length - 1
                        outElement = outElement[stack]

                        addnewChild = document.createElement('div')
                        addnewChild.classList.add('user_msg_area')
                        outElement.appendChild(addnewChild)


                        // 抓取最後一個Element
                        outElement = document.getElementsByClassName('user_msg_area')
                        stack = outElement.length - 1
                        outElement = outElement[stack]

                        addnewChild = document.createElement('div')
                        addnewChild.classList.add('user_name')
                        outElement.appendChild(addnewChild)


                        outElement = document.getElementsByClassName('user_name')
                        stack = outElement.length - 1
                        outElement = outElement[stack]

                        addnewChild = document.createElement('div')
                        addnewChild.classList.add('user_msg')
                        addnewChild.textContent = intputContent
                        outElement.appendChild(addnewChild)

                        addnewChild = document.createElement('div')
                        addnewChild.classList.add('delete')
                        addnewChild.textContent = 'delete'
                        addnewChild.addEventListener('click', (event) => {


                            const packate = {
                                user_id: userInfo[0].id, 
                                ser_name: userInfo[0].name,
                                class_msg: intputContent
                            }
                            deleteData(packate, event.path[2])
                            
                        })
                        outElement.appendChild(addnewChild)
                        

                        outElement = document.getElementsByClassName('user_msg_area')
                        stack = outElement.length - 1
                        outElement = outElement[stack]

                        addnewChild = document.createElement('img')
                        addnewChild.classList.add('user_img_msg')
                        addnewChild.src = './images/userIcon.png'
                        outElement.appendChild(addnewChild)
                        
                        document.getElementById('keyword').value = ''
                        document.getElementsByClassName('message_area')[0].scrollTop = -1000
                    }
                }
                reqDetailMsg.send(JSON.stringify(UserData))
            }else{
                alert('登入後才可以留言')
            }
        }
    })
})



// 獲得頁面資訊
const xhr = new XMLHttpRequest()
const userName = []
let originRating = -1

xhr.open('GET', `/detail/${queryParamsString}`, true)
xhr.setRequestHeader("authorization", 'Bearer ' + account_token);
document.getElementsByClassName('loading')[0].classList.remove('nano')

xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        const data = xhr.responseText
        const allData = JSON.parse(data)
        const objData = JSON.parse(data)[0]
        const msgData = JSON.parse(data)[2]
        const recommendData = JSON.parse(data)[3]
        userInfo.push(allData[4])


        document.getElementsByClassName('loading')[0].classList.add('nano')
        
        console.log(userInfo)

        userName.push(objData.number)
        

        if(allData[1].collect === 1){
            // 如果有收藏課程
            document.getElementsByClassName('collect_button')[0].style.display = 'none'
            document.getElementsByClassName('detail_mark')[0].style.display = 'flex'
        }else if(allData[1].collect === -1){
            // 如果沒有登入
            document.getElementsByClassName('collect_button')[0].style.display = 'none'
        }else{
            // 登入後，沒有該死的歐藏
            document.getElementsByClassName('collect_button')[0].style.display = 'flex'
            
        }

        if(allData[1].rating === -1){
            // 沒有登入
            document.getElementsByClassName('detail_mark')[0].style.display = 'none'
        }else{
            // 沒有評分
            originRating = +allData[1].rating

            clickStar = originRating

            changeStar(allData[1].rating)
            document.getElementsByClassName('detail_mark')[0].style.display = 'flex'
        }
        
        if(objData.image){
            document.getElementsByClassName('class_image')[0].src = objData.image
        }

        document.getElementsByClassName('detail_name')[0].textContent = objData.class_name.trim()
        if(objData.department.trim()){
            document.getElementsByClassName('detail_departnemt')[0].textContent = 'For' + objData.department
        }else{
            document.getElementsByClassName('detail_departnemt')[0].textContent = 'For everyone'
        }

        document.getElementsByClassName('detail_teacher')[0].textContent = '教授: ' + objData.professor
        document.getElementsByClassName('detail_source')[0].textContent = '課程來源: ' + objData.source

        const classData = objData.class_content.split('\n')

        try {
            if(classData[1].trim){
                document.getElementsByClassName('detail_data_text')[0].textContent = classData[1]
            }else{
                document.getElementsByClassName('detail_data_text')[0].textContent = 'no data'
            }
        } catch (error) {
            document.getElementsByClassName('detail_data_text')[0].textContent = 'no data'
        }

        document.getElementsByClassName('detail_web_url')[0].textContent = 'learn more...'
        document.getElementsByClassName('detail_web_url')[0].href = objData.web_url

        // 準備要拿取處理留言區
        
        for(let i = 0; i<msgData.length; i++){

            let outElement = document.getElementsByClassName('message_area')[0]
            let addnewChild = document.createElement('div')

            // 新的留言
            let msgStatus = 'get_message'

            if(msgData[i].user_id == allData[1].userId){
                msgStatus = 'self_message'
            }

            addnewChild.classList.add(msgStatus)
            outElement.appendChild(addnewChild)


            let outLenght = document.getElementsByClassName(msgStatus).length - 1

            outElement = document.getElementsByClassName(msgStatus)[outLenght]
            addnewChild = document.createElement('div')
            addnewChild.classList.add('user_msg_area')
            outElement.appendChild(addnewChild)
            
            // 放入資料
            function createImg(){
                outLenght = document.getElementsByClassName('user_msg_area').length - 1
            
                outElement = document.getElementsByClassName('user_msg_area')[outLenght]
                addnewChild = document.createElement('img')
                addnewChild.classList.add('user_img_msg')
                addnewChild.src = './images/userIcon.png'
                outElement.appendChild(addnewChild)
            }

            function createNameBox(){
                // user Name box
                outLenght = document.getElementsByClassName('user_msg_area').length - 1

                outElement = document.getElementsByClassName('user_msg_area')[outLenght]
                addnewChild = document.createElement('div')
                addnewChild.classList.add('user_name')
                outElement.appendChild(addnewChild)
            }

            if(msgStatus === 'get_message'){
                createImg()

                //user name
                createNameBox()
                outLenght = document.getElementsByClassName('user_name').length - 1

                outElement = document.getElementsByClassName('user_name')[outLenght]
                addnewChild = document.createElement('p')
                addnewChild.textContent = msgData[i].user_name
                outElement.appendChild(addnewChild)


                // user msg

                outElement = document.getElementsByClassName('user_name')[outLenght]
                addnewChild = document.createElement('div')
                addnewChild.classList.add('user_msg')
                addnewChild.textContent = addnewChild.textContent = msgData[i].class_msg

                outElement.appendChild(addnewChild)


                // 刪除別人的留言
                if(userInfo[0].root === 'admin'){
                    outElement = document.getElementsByClassName('user_name')[outLenght]
                    addnewChild = document.createElement('div')
                    addnewChild.classList.add('delete')
                    addnewChild.textContent = 'delete'
                    addnewChild.addEventListener('click', (event) => {
                        console.log('nice')

                        deleteData(msgData[i], event.path[2])
                    })
                    outElement.appendChild(addnewChild)
                }

                if(userInfo[0].root === 'admin'){
                    outElement = document.getElementsByClassName('user_name')[outLenght]
                    addnewChild = document.createElement('div')
                    addnewChild.classList.add('user_ban')
                    addnewChild.textContent = '禁言'
                    addnewChild.addEventListener('click', (event) => {
                        console.log('nice')
                        banUser(msgData[i].user_id)
                    })
                    outElement.appendChild(addnewChild)
                }

            }else{
                createNameBox()
                outLenght = document.getElementsByClassName('user_name').length - 1

                outElement = document.getElementsByClassName('user_name')[outLenght]
                addnewChild = document.createElement('div')
                addnewChild.classList.add('user_msg')
                addnewChild.textContent = addnewChild.textContent = msgData[i].class_msg
                outElement.appendChild(addnewChild)

                // 刪除自己的留言
                outElement = document.getElementsByClassName('user_name')[outLenght]
                addnewChild = document.createElement('div')
                addnewChild.classList.add('delete')
                addnewChild.textContent = 'delete'
                addnewChild.addEventListener('click', (event) => {
                    console.log('self')

                    deleteData(msgData[i], event.path[2])
                })
                outElement.appendChild(addnewChild)
                createImg()
            }
            document.getElementsByClassName('message_area')[0].scrollTop = -1000

        }


        //推薦課程 recommendData

        if(recommendData.data === 'false'){
            let outElemant = document.getElementsByClassName('recommend')[0]
            let addnewChild = document.createElement('img')
            addnewChild.classList.add('recommend_loading')
            addnewChild.src = './images/recommend404.png'
            outElemant.appendChild(addnewChild)

        }else{
            for(let num=0; num < recommendData.length; num++){
                // 創造一個新的課程
                let outElemant = document.getElementsByClassName('recommend')[0]
                let addnewChild = document.createElement('a')
                addnewChild.classList.add('class')
                addnewChild.href = './detail.html?'+recommendData[num].number
                addnewChild.target = "_blank"
                outElemant.appendChild(addnewChild)


                // 創建圖片的div
                outElemant = document.getElementsByClassName('class')[num]
                addnewChild = document.createElement('div')
                addnewChild.classList.add('class_image')
                outElemant.appendChild(addnewChild)

                // 創建圖片本人
                outElemant = document.getElementsByClassName('class_image')[num+1] //這裡需要＋1 因為會選到標題的照片
                addnewChild = document.createElement('img')
                if(recommendData[num].image){
                    addnewChild.src = recommendData[num].image
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
                let text = recommendData[num].class_name
                if(recommendData[num].class_name.length > 11){
                    addnewChild.style.fontSize = '20px'
                    text = text.substr(0, 10)
                    text += '...'
                }else if(recommendData[num].class_name.length > 8){
                    addnewChild.style.fontSize = '20px'
                }
                addnewChild.textContent = text
                outElemant.appendChild(addnewChild)


                //放入課程的內容-課程代碼
                outElemant = document.getElementsByClassName('class_text')[num]
                addnewChild = document.createElement('div')
                addnewChild.classList.add('class_item') 
                addnewChild.classList.add('class_num')
                addnewChild.textContent = recommendData[num].number
                outElemant.appendChild(addnewChild)


                //放入課程的內容-教授姓名
                outElemant = document.getElementsByClassName('class_text')[num]
                addnewChild = document.createElement('div')
                addnewChild.classList.add('class_item') 
                addnewChild.textContent = recommendData[num].professor
                outElemant.appendChild(addnewChild)

                //放入課程的內容-科系
                outElemant = document.getElementsByClassName('class_text')[num]
                addnewChild = document.createElement('div')
                addnewChild.classList.add('class_item') 
                if(recommendData[num].department.trim()){
                    addnewChild.textContent = '對象: ' + recommendData[num].department
                }else{
                    addnewChild.textContent = '對象: 所有'
                }
                outElemant.appendChild(addnewChild)

                //放入課程的內容-課程來源
                outElemant = document.getElementsByClassName('class_text')[num]
                addnewChild = document.createElement('div')
                addnewChild.classList.add('class_item') 
                addnewChild.textContent = '來源: ' + recommendData[num].source
                outElemant.appendChild(addnewChild)

                //放入課程的內容-課程分數
                outElemant = document.getElementsByClassName('class_text')[num]
                addnewChild = document.createElement('div')
                addnewChild.classList.add('class_item')  
                addnewChild.classList.add('class_mark')
                if( recommendData[num].mark !== null){
                    addnewChild.textContent = '評分: ' + recommendData[num].mark
                }else{
                    addnewChild.textContent = '評分: ~'
                }
                
                outElemant.appendChild(addnewChild)

            }
        }


    }
}

xhr.send()

// 禁言
async function banUser(dataMsg){
    
    const banUserReq = new XMLHttpRequest()
    banUserReq.open('PATCH', '/admin_account', true)
    banUserReq.setRequestHeader("authorization", 'Bearer ' + account_token);
    banUserReq.setRequestHeader("Content-Type", "application/json");

    banUserReq.onreadystatechange = function () {
        if (banUserReq.readyState === 4) {
            const data = banUserReq.responseText
            console.log(data)
            if(data === 'yes'){
                alert('禁言成功')
            }else{
                alert('失敗！')
            }
            
        }
    }

    const package = {
        userId: dataMsg,
        root:'',
        status: 'ban'
    }
    stringIt = JSON.stringify(package)
    banUserReq.send(stringIt)
}



// 刪除
async function deleteData(dataMsg, element){

    const deleteMsgReq = new XMLHttpRequest()
    deleteMsgReq.open('DELETE', '/classMsg', true)
    deleteMsgReq.setRequestHeader("authorization", 'Bearer ' + account_token);
    deleteMsgReq.setRequestHeader("Content-Type", "application/json");

    deleteMsgReq.onreadystatechange = function () {
        if (deleteMsgReq.readyState === 4) {
            const data = deleteMsgReq.responseText
            console.log(data)
            if(data === 'yes'){
                element.remove()
                alert('刪除成功')
            }
            
        }
    }

    let stringIt = dataMsg
    console.log(stringIt)
    stringIt.number = userName[0]
    stringIt = JSON.stringify(stringIt)
    deleteMsgReq.send(stringIt)
}


// 收藏
document.getElementsByClassName('collect_button')[0].addEventListener('click', () => {
    document.getElementsByClassName('collect_button')[0].style.display = 'none'
    
    const addCollect = new XMLHttpRequest()

    let sendData = {
        token: account_token,
        number: userName[0]
    }

    addCollect.open('POST', '/collect', true)
    addCollect.setRequestHeader("authorization", 'Bearer ' + account_token);
    addCollect.setRequestHeader("Content-Type", "application/json");
    
    addCollect.onreadystatechange = function () {
        if (addCollect.readyState === 4) {
            const data = addCollect.responseText
            
        }
    }

    addCollect.send(JSON.stringify(sendData))
})



// 評分
document.getElementsByClassName('detail_mark')[0].addEventListener('click', (event) => {
    
    clickStar = event.path[0].id
    clickStar = clickStar.split('star')[1]
    clickStar = 6 - +clickStar // 校正回歸

    changeStar(clickStar)
})

function changeStar (num) {
    for(let i=0; i < 5; i++){
        if(i+1 <= num){
            document.getElementById(`star${6 - (i+1)}`).src = '../images/star2.png'
        }else{
            document.getElementById(`star${6 - (i+1)}`).src = '../images/star1.png'
        }
    }
}


// 關閉網頁之後，才執行。
window.onbeforeunload =  () => {
    if(clickStar !== -1 && clickStar !== originRating){
        const addrating = new XMLHttpRequest()

        let sendData = {
            number: userName[0],
            mark: clickStar
        }

        addrating.open('POST', '/rating', true)
        addrating.setRequestHeader("authorization", 'Bearer ' + account_token);
        addrating.setRequestHeader("Content-Type", "application/json");
        
        // addrating.onreadystatechange = function () {
        //     if (addrating.readyState === 4) {
        //         const data = addrating.responseText
        //     }
        // }

        addrating.send(JSON.stringify(sendData))
    }

}