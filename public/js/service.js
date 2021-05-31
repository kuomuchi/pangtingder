// 查看是否有登入
const account_token = window.localStorage.getItem('account_token')
if(!window.localStorage.getItem('account_token')){
  alert('客服功能需要登入')
  window.location.href = '/login.html'
}

const userData = {
  userName:'',
  userId:'',
  msg: ''
}


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
    }

    userData.userName = getUserData.name
    userData.userId = getUserData.id

    for(let i = 0; i<getData[0].length; i++){
      const data = getData[0][i]
      if(data.sendTo === 'admin'){
        selfMsg(data.content)
      }else{
        getMsg(data.content)
      }
    }

  }
}
xhr.send()


// 抓取網頁ip
let ip = location.href
ip = ip.split('/')
ip = ip[0] + '//' + ip[2]

const socket = io(ip)







document.getElementsByClassName('send_buttom')[0].addEventListener('click', () => {
  const msg = document.getElementsByClassName('input')[0].value
  if(msg){

    selfMsg(msg)
    document.getElementsByClassName('input')[0].value = ''

    userData.msg = msg
    socket.emit('sendMsg', userData)
    // 加入DB
    sendMsg(msg)
  }
})

// 即時顯示
socket.on('sendMsg', (msg) =>{
  if(+userData.userId === +msg.sendTo){
    getMsg(msg.msg)
  }
  
})


// 傳送訊息
const sendMsg = async (content) => {

  const data = {
    content: content,
    sendTo: 'admin'
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


// 獲得顯示別人的訊息
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
const getMsg = (msg)=>{
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
  addnewChild.textContent = '客服'

  outElement.appendChild(addnewChild)


  addnewChild = document.createElement('div')
  addnewChild.classList.add('user_msg')
  addnewChild.textContent = msg
  outElement.appendChild(addnewChild)
  outElement.scrollIntoView()
}