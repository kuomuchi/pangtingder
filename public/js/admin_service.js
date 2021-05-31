// 抓取網頁ip
let ip = location.href
ip = ip.split('/')
ip = ip[0] + '//' + ip[2]

const socket = io(ip)


// 查看是否有登入
const account_token = window.localStorage.getItem('account_token')
if(!window.localStorage.getItem('account_token')){
  alert('客服功能需要登入')
  window.location.href = '/login.html'
}

const userData = {
  userName:'',
  userId:'',
  msg: '',
  sendTo: ''
}

let SendTo = -1

// 抓取解析Token
const xhr = new XMLHttpRequest()
xhr.open('GET', '/service', true)
xhr.setRequestHeader("authorization", 'Bearer ' + account_token);

xhr.onreadystatechange = function () {
  if(xhr.readyState == 4 && xhr.status == 200){
    let getData = "";
    getData = xhr.responseText;
    getData = JSON.parse(getData)
    getUserData = getData[1]
    

    if(getData.data === 'failure'){
      window.localStorage.removeItem('account_token')
      alert('請重新登入')
      window.location.href = '/login.html'
    }else if(getUserData.root !== 'admin'){
      alert('你跑錯地方囉～')
      window.location.href = '/service.html'
    }else{
      userData.userId = getUserData.id
      userData.userName = getUserData.name
    }

    for(let i = 0; i < getData[2].length; i++){
      // 創建 用戶欄位
      getUserItem(getData[2][i])
    }


  }
}
xhr.send()


document.getElementsByClassName('send_buttom')[0].addEventListener('click', (event) => {

  const msg = document.getElementsByClassName('input')[0].value
  console.log(SendTo)
  if(msg){
    if(SendTo !== -1){
      selfMsg(msg)
      document.getElementsByClassName('input')[0].value = ''

      userData.msg = msg
      userData.sendTo = SendTo
      socket.emit('sendMsg', userData)
      sendMsg(msg)

    }else{
      alert('這只是範例！')
    }
  }
})





//  抓取文字內容
socket.on('sendMsg', (msg) =>{
  let newMsg = msg.msg
  if(newMsg.length > 8){
    newMsg = newMsg.substr(0, 7)
    newMsg = newMsg + '...'
  }
  document.querySelector(`#user${msg.userId} > div > p.history_msg`).textContent = newMsg

  if(+SendTo === +msg.userId){
    
    getMsg(newMsg, msg.userName)
    
  }
})

const sendMsg = async (content) => {

  if(SendTo !== -1){  
    const data = {
      content: content,
      sendTo: SendTo
    }

    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/service', true)
    xhr.setRequestHeader("authorization", 'Bearer ' + account_token);
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.onreadystatechange = function () {
      if(xhr.readyState == 4 && xhr.status == 200){
        let getData = "";
        getData = xhr.responseText;
        getData = JSON.parse(getData)
      }
    }

    xhr.send(JSON.stringify(data))
  }
}



const selfMsg = (msg) =>{
  let outElement = document.getElementsByClassName('msg_box')[0]
  let addnewChild = document.createElement('div')
  addnewChild.classList.add('self_message')

  outElement.appendChild(addnewChild)

  let length = document.getElementsByClassName('self_message').length

  outElement = document.getElementsByClassName('self_message')[length - 1]
  addnewChild = document.createElement('div')

  addnewChild.classList.add('user_msg')

  addnewChild.textContent = msg

  outElement.appendChild(addnewChild)
  outElement.scrollIntoView()
}


// 獲得顯示自己的訊息
const getMsg = (msg, name)=>{
  let outElement = document.getElementsByClassName('msg_box')[0]
  let addnewChild = document.createElement('div')
  addnewChild.classList.add('get_message')

  outElement.appendChild(addnewChild)

  let length = document.getElementsByClassName('get_message').length
  
  outElement = document.getElementsByClassName('get_message')[length - 1]
  addnewChild = document.createElement('img')
  addnewChild.classList.add('user_img_msg')
  addnewChild.src = './images/userIcon.png'
  outElement.appendChild(addnewChild)


  addnewChild = document.createElement('div')
  addnewChild.classList.add('user_name')
  outElement.appendChild(addnewChild)

  length = document.getElementsByClassName('user_name').length
  outElement = document.getElementsByClassName('user_name')[length - 1]
  addnewChild = document.createElement('p')
  addnewChild.textContent = name

  outElement.appendChild(addnewChild)


  addnewChild = document.createElement('div')
  addnewChild.classList.add('user_msg')
  addnewChild.textContent = msg
  outElement.appendChild(addnewChild)
  outElement.scrollIntoView()
}


const getUserItem = (getData) => {
  let outElement = document.getElementsByClassName('user_list_box')[0]
  let addnewChild = document.createElement('div')
  addnewChild.classList.add('user_item')
  addnewChild.id = 'user'+getData.user_id
  addnewChild.addEventListener('click', () => {
    const id = getData.user_id
    SendTo = id
    getUserHistiry(SendTo)
  })
  addnewChild.tabIndex = '1'
  outElement.appendChild(addnewChild)

  let length = document.getElementsByClassName('user_item').length
  outElement = document.getElementsByClassName('user_item')[length - 1]
  addnewChild = document.createElement('img')
  addnewChild.src="./images/userIcon.png"
  addnewChild.classList.add('user_img_msg')
  outElement.appendChild(addnewChild)

  length = document.getElementsByClassName('user_item').length
  outElement = document.getElementsByClassName('user_item')[length - 1]
  addnewChild = document.createElement('div')
  addnewChild.classList.add('item_text')
  outElement.appendChild(addnewChild)

  length = document.getElementsByClassName('item_text').length
  outElement = document.getElementsByClassName('item_text')[length - 1]
  addnewChild = document.createElement('p')
  addnewChild.classList.add('user')
  addnewChild.textContent = getData.user_name
  outElement.appendChild(addnewChild)

  length = document.getElementsByClassName('item_text').length
  outElement = document.getElementsByClassName('item_text')[length - 1]
  addnewChild = document.createElement('p')
  addnewChild.classList.add('history_msg')
  addnewChild.textContent = 'msg'
  outElement.appendChild(addnewChild)
}


const getUserHistiry = (id) => {
  const xhrMsg = new XMLHttpRequest()
  xhrMsg.open('POST', '/admin_service', true)
  xhrMsg.setRequestHeader("authorization", 'Bearer ' + account_token);
  xhrMsg.setRequestHeader("Content-Type", "application/json")
  xhrMsg.onreadystatechange = function () {
    if(xhrMsg.readyState == 4 && xhrMsg.status == 200){
      let getData = "";
      getData = xhrMsg.responseText;
      getData = JSON.parse(getData)
      if(getData.data === 'failure'){
        alert('僅限admin')
        window.location.href = '/service.html'
      }else{
        document.getElementsByClassName('msg_box')[0].innerHTML = ''
        for(let i = 0; i<getData.length; i++){
          const data = getData[i]

          if(data.sendTo === 'admin'){
            getMsg(data.content, data.user_name)

          }else{
            selfMsg(data.content)

          }
        }
      }
    }
  }
  const sendId = {
    data: id
  }
  xhrMsg.send(JSON.stringify(sendId))
}