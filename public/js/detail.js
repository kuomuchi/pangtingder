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
document.getElementById('keyword').addEventListener('focus', () => {

    window.addEventListener('keyup', (event) => {
        const intputContent =  document.getElementById('keyword').value
        if(event.code === 'Enter' && intputContent.trim()){
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

                reqDetailMsg.onreadystatechange = function () {
                    const resend = reqDetailMsg.responseText
                    console.log(resend)

                    if(resend === 'false'){
                        window.localStorage.removeItem('account_token')
                        alert('登入逾時')

                    }else if(resend === 'success'){
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

                        outElement = document.getElementsByClassName('user_msg_area')
                        stack = outElement.length - 1
                        outElement = outElement[stack]

                        addnewChild = document.createElement('img')
                        addnewChild.classList.add('user_img_msg')
                        addnewChild.src = './images/userIcon.png'
                        outElement.appendChild(addnewChild)
                        
                        document.getElementById('keyword').value = ''
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

xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        const data = xhr.responseText
        const allData = JSON.parse(data)
        const objData = JSON.parse(data)[0]
        const msgData = JSON.parse(data)[2]

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
        

        document.getElementsByClassName('detail_name')[0].textContent = objData.class_name
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

        document.getElementsByClassName('detail_web_url')[0].textContent = objData.web_url
        document.getElementsByClassName('detail_web_url')[0].href = objData.web_url

        // 準備要拿取處理留言區

        for(let i = 0; i<msgData.length; i++){
            let outElement = document.getElementsByClassName('message_area')[0]
            let addnewChild = document.createElement('div')

            // 新的class
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
                console.log(msgData[i])
                addnewChild.textContent = msgData[i].user_name
                outElement.appendChild(addnewChild)


                // user msg

                outElement = document.getElementsByClassName('user_name')[outLenght]
                addnewChild = document.createElement('div')
                addnewChild.classList.add('user_msg')
                addnewChild.textContent = addnewChild.textContent = msgData[i].class_msg
                outElement.appendChild(addnewChild)
            }else{
                createNameBox()
                outLenght = document.getElementsByClassName('user_name').length - 1

                outElement = document.getElementsByClassName('user_name')[outLenght]
                addnewChild = document.createElement('div')
                addnewChild.classList.add('user_msg')
                addnewChild.textContent = addnewChild.textContent = msgData[i].class_msg
                outElement.appendChild(addnewChild)
                createImg()
            }
            

            


        }

    }
}

xhr.send()



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