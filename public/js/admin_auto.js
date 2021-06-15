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
  getAuto(nowPage)
  document.getElementsByClassName('page')[0].textContent = nowPage + 1
})

// 上一頁
document.getElementsByClassName('previous')[0].addEventListener('click', () => {
  if(nowPage > 0){
    removeAllUser()
    nowPage--
    getAuto(nowPage)
    document.getElementsByClassName('page')[0].textContent = nowPage + 1  

  }else{
    alert('到底了')
  }
  
})

// 更新
document.getElementsByClassName('save')[0].addEventListener('click' , () => {
  const event = document.getElementsByClassName('event_name')[0].textContent
  
  let run = document.getElementById("status_click").selectedIndex

  if(+run){
    run = 0
  }else{
    run = 1
  }

  let status = document.getElementById("status").selectedIndex

  if(+status){
    status = 0
  }else{
    status = 1
  }

  console.log(event.substr(4))
  
  if(event.substr(4)){
    const package = {
      status: status,
      run: run,
      event: event.substr(4)
    }

    resetData()
    upData(package)
    

  }else{
    alert('請選擇事件')
  }


})


// reset重置
document.getElementsByClassName('reset')[0].addEventListener('click', () => {
  resetData()
})



// 獲得工作
const getAuto = (num) => {

  const xhrAdmin = new XMLHttpRequest()
  xhrAdmin.open('POST', '/admin_auto', true)
  xhrAdmin.setRequestHeader("authorization", 'Bearer ' + account_token);
  xhrAdmin.setRequestHeader("Content-Type", "application/json");

  xhrAdmin.onreadystatechange = function () {
    if(xhrAdmin.readyState == 4 && xhrAdmin.status == 200){
      let getData = "";
      getData = xhrAdmin.responseText;
      getData = JSON.parse(getData)
      console.log(getData)

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

            document.getElementsByClassName('event_name')[0].textContent = '事件: ' + getData[i].work
            let status = getData[i].status
            let run = getData[i].run
            document.getElementById("status_click").style.display = ''
            document.getElementById("status").style.display = ''

            if(+run){
              document.getElementById("status_click").selectedIndex = 0
            }else{
              document.getElementById("status_click").selectedIndex = 1
            }


            if(+status === 1){
              status = '啟動'
              document.getElementById("status").selectedIndex = 0
            }else if(!+status){
              status = '關閉'
              document.getElementById("status").selectedIndex = 1
            }


            document.getElementsByClassName('event_status')[0].textContent = '狀態: ' + status
            document.getElementsByClassName('event_time')[0].textContent = '上次更新時間: ' + getData[i].time
            document.getElementsByClassName('event_msg')[0].textContent ='訊息: ' + getData[i].msg
          })

          outElement.appendChild(addNewChild)

          // 名稱
          outElement = document.getElementsByClassName('account')[i]
          addNewChild = document.createElement('div')
          addNewChild.classList.add('account_item')
          addNewChild.textContent = getData[i].work
          outElement.appendChild(addNewChild)


          // 狀態
          addNewChild = document.createElement('div')
          addNewChild.classList.add('account_item')
          addNewChild.classList.add('status')
          let status = getData[i].status
          let statusColor = ''
          if(+status === 1){
            statusColor = '#00EC00'
            addNewChild.textContent = '啟動'
          }else{
            statusColor = 'red'
            addNewChild.textContent = '關閉'
          }
          outElement.appendChild(addNewChild)


          addNewChild = document.createElement('div')
          addNewChild.classList.add('account_item')
          addNewChild.classList.add('root')
          let run = getData[i].run
          let rootColor = ''
          if(+run === 1){
            rootColor = '#00EC00'
            addNewChild.textContent = '使用中...'
          }else{
            rootColor = 'red'
            addNewChild.textContent = '關閉'
          }

          outElement.appendChild(addNewChild)

          // 時間
          addNewChild = document.createElement('div')
          addNewChild.classList.add('time_item')
          let getTime = getData[i].time
          if(getTime){
            getTime = getTime.split(' ')[0]
          }
          addNewChild.textContent = getTime
          outElement.appendChild(addNewChild)


          // 新稱 status root 的 顏色。
          outElement = document.getElementsByClassName('status')[i]
          addNewChild = document.createElement('div')
          addNewChild.classList.add('status_color')
          addNewChild.style.backgroundColor = statusColor
          outElement.appendChild(addNewChild)

          outElement = document.getElementsByClassName('root')[i]
          addNewChild = document.createElement('div')
          addNewChild.classList.add('status_color')
          addNewChild.style.backgroundColor = rootColor
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



async function upData(dataMsg){

  if(dataMsg.run){
    runEvent(dataMsg.event)
  }
    
  const upDataReq = new XMLHttpRequest()
  upDataReq.open('PATCH', '/admin_auto', true)
  upDataReq.setRequestHeader("authorization", 'Bearer ' + account_token);
  upDataReq.setRequestHeader("Content-Type", "application/json");

  upDataReq.onreadystatechange = function () {
      if (upDataReq.readyState === 4) {
          const data = upDataReq.responseText
          console.log(data)
          if(data === 'yes'){
              alert('更新成功')
              removeAllUser()
              getAuto(nowPage)
          }else{
              alert('更新失敗！')
          }
          
      }
  }
  upDataReq.send(JSON.stringify(dataMsg))
}


function runEvent(event){
  const runEventReq = new XMLHttpRequest()
  runEventReq.open('GET', '/'+event, true)
  runEventReq.setRequestHeader("authorization", 'Bearer ' + account_token);

  runEventReq.onreadystatechange = function () {
    if (runEventReq.readyState === 4) {

      let getData = "";
      getData = runEventReq.responseText;

      if(getData === 'yes'){
        console.log('is runing right now')
      }else{
        console.log('false')
      }
    }
  }

  runEventReq.send()
  
}

function removeAllUser(){
  const getAllClass = document.getElementsByClassName('account')
  document.getElementsByClassName('selecter')[0].classList.add('none')
  const maxnum = getAllClass.length
  for(let num = 0; num < maxnum; num++){
      getAllClass[0].remove()
  }
}

function resetData() {
  document.getElementsByClassName('selecter')[0].classList.add('none')
  document.getElementsByClassName('event_name')[0].textContent = '事件: '
  document.getElementsByClassName('event_status')[0].textContent = '狀態: '
  document.getElementsByClassName('event_time')[0].textContent = '上次更新時間: '
  document.getElementsByClassName('event_msg')[0].textContent ='訊息: '
  document.getElementById("status").selectedIndex = 0;
  document.getElementById("status").style.display = 'none'
  document.getElementById("status_click").style.display = 'none'
  
}

resetData()
getAuto(nowPage)