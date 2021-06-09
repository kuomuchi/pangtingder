// 確認玩家身份
const account_token = window.localStorage.getItem('account_token')
if(!window.localStorage.getItem('account_token')){
  alert('課程編輯需要登入')
  window.location.href = '/login.html'
}

let nowPage = 0

// 下一頁
document.getElementsByClassName('next')[0].addEventListener('click', () => {
  removeAllUser()
  nowPage++
  getAccount(nowPage)
  document.getElementsByClassName('page')[0].textContent = nowPage + 1
})

// 上一頁
document.getElementsByClassName('previous')[0].addEventListener('click', () => {
  if(nowPage > 0){
    removeAllUser()
    nowPage--
    getAccount(nowPage)
    document.getElementsByClassName('page')[0].textContent = nowPage + 1  

  }else{
    alert('到底了')
  }
  
})


// reset重置
document.getElementsByClassName('reset')[0].addEventListener('click', () => {
  resetData()
})


// 更新用戶
document.getElementsByClassName('save')[0].addEventListener('click', () => {
  let userId = document.getElementsByClassName('user_id')[0].textContent
  userId = userId.substr(4)

  console.log(userId)

  if(userId){
    const upData = {
      userId: userId,
      root:document.getElementById("root").value,
      status: document.getElementById("status").value
    }

    changeRoot(upData)
    resetData()


  }else{
    alert('請選擇用戶')
  }
  
})


// 獲得用戶
const getAccount = (num) => {

  const xhrAdmin = new XMLHttpRequest()
  xhrAdmin.open('POST', '/admin_account', true)
  xhrAdmin.setRequestHeader("authorization", 'Bearer ' + account_token);
  xhrAdmin.setRequestHeader("Content-Type", "application/json");

  xhrAdmin.onreadystatechange = function () {
    if(xhrAdmin.readyState == 4 && xhrAdmin.status == 200){
      let getData = "";
      getData = xhrAdmin.responseText;
      getData = JSON.parse(getData)

      if(!getData){
        alert('你沒有權限喔')
        window.location.href = '/profile.html'
      }else{

        for(let i = 0; i< getData.length; i++){
          let outElement = document.getElementsByClassName('account_box')[0]
          let addNewChild = document.createElement('div')
          addNewChild.classList.add('account')

          // 點擊
          addNewChild.addEventListener('click', async () => {

            getAccountDetail(getData[i].id)

            const position = addNewChild.offsetTop
            document.getElementsByClassName('selecter')[0].classList.remove('none')
            document.getElementsByClassName('selecter')[0].style.top = position

            document.getElementsByClassName('user_name')[0].textContent = '用戶: ' + getData[i].user_name
            document.getElementsByClassName('user_email')[0].textContent = 'email: ' + getData[i].email
            document.getElementsByClassName('user_id')[0].textContent = '編號: ' + getData[i].id

            if(getData[i].root === 'admin'){
              document.getElementById("root").selectedIndex = 1;
            }else{
              document.getElementById("root").selectedIndex = 0;
            }

            
            if(getData[i].status === 'normal'){
              document.getElementById("status").selectedIndex = 0;
            }else{
              document.getElementById("status").selectedIndex = 1;
            }
            
          })

          outElement.appendChild(addNewChild)

          outElement = document.getElementsByClassName('account')[i]
          addNewChild = document.createElement('div')
          addNewChild.classList.add('account_item')
          addNewChild.textContent = getData[i].id
          outElement.appendChild(addNewChild)


          // 名稱
          addNewChild = document.createElement('div')
          addNewChild.classList.add('account_item')
          let text = getData[i].user_name.trim()
          if(text.length > 12){
            text = text.substr(0, 12)
            text += '...'
          }
          addNewChild.textContent = text
          outElement.appendChild(addNewChild)

          addNewChild = document.createElement('div')
          addNewChild.classList.add('account_item')
          addNewChild.textContent = getData[i].root
          outElement.appendChild(addNewChild)


          addNewChild = document.createElement('div')
          addNewChild.classList.add('account_item')
          addNewChild.textContent = getData[i].status
          outElement.appendChild(addNewChild)
        }



      }
    }
  }
  const selecter = {
    keyword: '%',
    page: 0
  }

  selecter.page = num
  xhrAdmin.send(JSON.stringify(selecter))

}

const getAccountDetail = (userId) => {

  const xhrAdmin = new XMLHttpRequest()
  xhrAdmin.open('POST', '/admin_account', true)
  xhrAdmin.setRequestHeader("authorization", 'Bearer ' + account_token);
  xhrAdmin.setRequestHeader("Content-Type", "application/json");

  xhrAdmin.onreadystatechange = function () {

    if(xhrAdmin.readyState == 4 && xhrAdmin.status == 200){
      let getData = "";
      getData = xhrAdmin.responseText;
      getData = JSON.parse(getData)
      if(!getData){

        alert('你沒有權限喔')
        window.location.href = '/profile.html'

      }else{
        
        document.getElementsByClassName('user_msg_time')[0].textContent ='留言次數: ' +  getData[0].msgTime
        document.getElementsByClassName('user_collect')[0].textContent = '收藏數量: ' + getData[1].collectTime

      }

    }
    
  }
  const getDetail = {
    userId: userId,
  }


  xhrAdmin.send(JSON.stringify(getDetail))

}


async function changeRoot(dataMsg){
    
  const banUserReq = new XMLHttpRequest()
  banUserReq.open('PATCH', '/admin_account', true)
  banUserReq.setRequestHeader("authorization", 'Bearer ' + account_token);
  banUserReq.setRequestHeader("Content-Type", "application/json");

  banUserReq.onreadystatechange = function () {
      if (banUserReq.readyState === 4) {
          const data = banUserReq.responseText
          console.log(data)
          if(data === 'yes'){
              alert('更新成功')
              removeAllUser()
              getAccount(nowPage)
          }else{
              alert('更新失敗！')
          }
          
      }
  }
  banUserReq.send(JSON.stringify(dataMsg))
}



function removeAllUser(){
  const getAllClass = document.getElementsByClassName('account')
  document.getElementsByClassName('selecter')[0].classList.add('none')
  const maxnum = getAllClass.length
  for(let num = 0; num < maxnum; num++){
      getAllClass[0].remove()
  }
}

function resetData () {
  document.getElementsByClassName('selecter')[0].classList.add('none')
  document.getElementsByClassName('user_name')[0].textContent = '用戶: '
  document.getElementsByClassName('user_email')[0].textContent = 'email: '
  document.getElementsByClassName('user_id')[0].textContent = '編號: '
  document.getElementsByClassName('user_msg_time')[0].textContent ='留言次數: '
  document.getElementsByClassName('user_collect')[0].textContent = '收藏數量: '
  document.getElementById("root").selectedIndex = 0;
  document.getElementById("status").selectedIndex = 0;
}


getAccount(nowPage)