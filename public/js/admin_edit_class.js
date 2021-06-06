// 確認玩家身份
const account_token = window.localStorage.getItem('account_token')
if(!window.localStorage.getItem('account_token')){
  alert('課程編輯需要登入')
  window.location.href = '/login.html'
}


const xhrAdmin = new XMLHttpRequest()
xhrAdmin.open('GET', '/admin_editclass', true)
xhrAdmin.setRequestHeader("authorization", 'Bearer ' + account_token);

xhrAdmin.onreadystatechange = function () {
  if(xhrAdmin.readyState == 4 && xhrAdmin.status == 200){
    let getData = "";
    getData = xhrAdmin.responseText;
    getData = JSON.parse(getData)
    getUserData = getData[1]

    if(!getData.data){
      alert('你沒有權限喔')
      window.location.href = '/profile.html'
    }
  }
}
xhrAdmin.send()


// 顯示課程

let nowpage = 0;
let nowClass = -1
let allClassArray = ''
let getMaxPage = 9990


const nowSelect = {
  popular: '',
  source: '%',
  keyword: document.getElementById('keyword').value
}


// 搜尋
document.getElementById('keyword').addEventListener('keyup', (event) => {
  if(event.code === 'Enter'){
      sendingData()
  }
})

// 上一頁
document.getElementById('previous').addEventListener('click', () => {
  const haveClass = document.getElementsByClassName('class').length

  if(nowpage === 0){
    alert('到底？')
  }else if(haveClass){
    resetClass()
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
    resetClass()
    removeAllClass()
    nowpage++
    document.getElementsByClassName('now_Page')[0].textContent = nowpage +1
    getNextPage(nowpage)
  }else{
    alert('你按太快了！慢慢來，溫柔一點')
  }

})


// 重置課程
document.getElementsByClassName('edit_reset')[0].addEventListener('click', () => {
  resetClass()
  document.getElementsByClassName('edit_reset')[0].textContent = 'reset'
  document.getElementsByClassName('selecter')[0].classList.add('none')
})


// 新增課程
document.getElementsByClassName('edit_create')[0].addEventListener('click', () => {
  resetClass()
  let time = new Date().toLocaleString('zh-TW');
  time = time.split('/')
  second = time[2].split(':')
  time = 'sf' + ((+time[0] + +time[1]) + second[0].substr(0,1) + second[0].substr(4,4) + (+second[1] + +second[2]))

  nowClass = -2

  document.getElementsByClassName('edit_number')[0].textContent = time
  document.getElementsByClassName('edit_box')[0].classList.add('change_color')
  document.getElementsByClassName('edit_reset')[0].textContent = 'cancel'

})


// 刪除課程

document.getElementsByClassName('edit_remove')[0].addEventListener('click', () => {
  if(nowClass !== -1 && nowClass !== -2){

    alert('警告：刪除此動作無法恢復')

    let deleteWarning = prompt('輸入「delete」刪除課程');
    if(deleteWarning === 'delete'){

      const upDateClass = {
        number: document.getElementsByClassName('edit_number')[0].textContent
      }
      const deleteXhr = new XMLHttpRequest()
      deleteXhr.open('DELETE', `/admin_editclass`, true)
      deleteXhr.setRequestHeader("authorization", 'Bearer ' + account_token);
      deleteXhr.setRequestHeader("Content-Type", "application/json");

      deleteXhr.onreadystatechange = function () {
        if (deleteXhr.readyState === 4) {
          const data = deleteXhr.responseText
          const objData = JSON.parse(data)
          if(objData.data){
            alert('更新成功')
          }else{
            alert('更新失敗')
          }
          resetClass()
          removeAllClass()
          getNextPage(nowpage)
        }
      }
      deleteXhr.send(JSON.stringify(upDateClass))

    }
  }
})



// 更新課程
document.getElementsByClassName('edit_save')[0].addEventListener('click', () => {

  const upDateClass = {
    number: document.getElementsByClassName('edit_number')[0].textContent,
    class_name: document.getElementsByClassName('edit_name')[0].value,
    department: document.getElementsByClassName('edit_department')[0].value,
    professor: document.getElementsByClassName('edit_professor')[0].value,
    class_content: '',
    remarks: document.getElementsByClassName('edit_remark')[0].value,
    web_url: document.getElementsByClassName('edit_url')[0].value,
    source: document.getElementsByClassName('edit_source')[0].value
  }

  if(nowClass !== -1  && nowClass !== -2){
    if(upDateClass.class_name.length && upDateClass.professor.length){
      let upDate = confirm('確認更新課程？');

        if (upDate) {
        let classContent = allClassArray[nowClass].class_content.split('\n')
        classContent[1] = document.getElementsByClassName('edit_content')[0].value
        classContent = classContent.join('\n')
        upDateClass.class_content = classContent

        const updateXhr = new XMLHttpRequest()
        updateXhr.open('PATCH', `/admin_editclass`, true)
        updateXhr.setRequestHeader("authorization", 'Bearer ' + account_token);
        updateXhr.setRequestHeader("Content-Type", "application/json");

        updateXhr.onreadystatechange = function () {
          if (updateXhr.readyState === 4) {
            const data = updateXhr.responseText
            const objData = JSON.parse(data)
            if(objData.data){
              alert('更新成功')
            }else{
              alert('更新失敗')
            }
            resetClass()
            removeAllClass()
            getNextPage(nowpage)
          }
        }
        updateXhr.send(JSON.stringify(upDateClass))
      }

    }else{
      alert('教授、課程名稱，不能為null。')
    }

  }else if(nowClass === -1){
    alert('請選擇課程')
  }else if(nowClass === -2){

    if(upDateClass.class_name.length && upDateClass.professor.length){
      
      let classContent = document.getElementsByClassName('edit_content')[0].value
      classContent = '\n' + classContent + '\n'

      upDateClass.class_content =  classContent
      console.log(upDateClass)

      const createdateXhr = new XMLHttpRequest()
      createdateXhr.open('POST', `/admin_editclass`, true)
      createdateXhr.setRequestHeader("authorization", 'Bearer ' + account_token);
      createdateXhr.setRequestHeader("Content-Type", "application/json");

      createdateXhr.onreadystatechange = function () {
        if (createdateXhr.readyState === 4) {
          const data = createdateXhr.responseText
          const objData = JSON.parse(data)
          if(objData.data){
            alert('創建成功')
          }else{
            alert('更新失敗')
          }
          
          resetClass()
          removeAllClass()
          getNextPage(nowpage)
        }
      }

      createdateXhr.send(JSON.stringify(upDateClass))

    }

  }else{
    alert('教授、課程名稱，不能為null。')
  }
})


getNextPage(nowpage)


function getNextPage(num){
  const xhr = new XMLHttpRequest()

  xhr.open('POST', `/learnpage/${num}`, true)
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      const data = xhr.responseText
      const objData = JSON.parse(data)

      allClassArray = objData
      const num = objData.length - 1
      getMaxPage = objData[num].maxpage

      for(let i=0; i < objData.length -1; i++){
        let outElemant = document.getElementsByClassName('class_box_item')[0]
        let addnewChild = document.createElement('div')
        addnewChild.classList.add('class')

        // 當被點擊的時候
        addnewChild.addEventListener('click', () => {

          document.getElementsByClassName('selecter')[0].classList.remove('none')

          document.getElementsByClassName('edit_number')[0].textContent = objData[i].number
          document.getElementsByClassName('edit_name')[0].value = objData[i].class_name
          document.getElementsByClassName('edit_department')[0].value = objData[i].department

          nowClass = i
          // console.log(objData[i].class_content)

          let classData = objData[i].class_content.split('\n')

          try {
            if(classData[1].trim){
              classData = classData[1]
            }else{
              classData = ' '
            }
          } catch (error) {
            classData = ' '
          }

          document.getElementsByClassName('edit_professor')[0].value = objData[i].professor
          document.getElementsByClassName('edit_content')[0].value = classData
          document.getElementsByClassName('edit_remark')[0].value = objData[i].remarks
          document.getElementsByClassName('edit_url')[0].value = objData[i].web_url
          document.getElementsByClassName('edit_source')[0].value = objData[i].source

          const position = addnewChild.offsetTop
          document.getElementsByClassName('selecter')[0].style.top = position

          document.getElementsByClassName('edit_remove')[0].classList.remove('none')

        })
        outElemant.appendChild(addnewChild)


        //放入課程的內容-課程代碼
        outElemant = document.getElementsByClassName('class')[i]
        addnewChild = document.createElement('div')
        addnewChild.classList.add('class_item') 
        addnewChild.classList.add('class_num')
        addnewChild.textContent = objData[i].number
        outElemant.appendChild(addnewChild)


        //放入課程的內容-課程名稱
        outElemant = document.getElementsByClassName('class')[i]
        addnewChild = document.createElement('div')
        addnewChild.classList.add('class_item') 
        addnewChild.classList.add('class_name')
        let text = objData[i].class_name
        if(objData[i].class_name.length > 6){
            text = text.substr(0, 6)
            text += '...'
        }
        addnewChild.textContent = text
        outElemant.appendChild(addnewChild)
        

        //放入課程的內容-教授姓名
        outElemant = document.getElementsByClassName('class')[i]
        addnewChild = document.createElement('div')
        addnewChild.classList.add('class_item') 
        addnewChild.textContent = objData[i].professor
        outElemant.appendChild(addnewChild)


        //放入課程的內容-課程來源
        outElemant = document.getElementsByClassName('class')[i]
        addnewChild = document.createElement('div')
        addnewChild.classList.add('class_item') 
        addnewChild.textContent = objData[i].source
        outElemant.appendChild(addnewChild)
      }
      
    }
  }


  xhr.send(JSON.stringify(nowSelect))
}



const sendingData = () => {
  const haveClass = document.getElementsByClassName('class').length
  nowSelect.keyword = document.getElementById('keyword').value
  // console.log(nowSelect)
  nowpage = 0
  resetClass()
  removeAllClass()
  getNextPage(nowpage)
  document.getElementsByClassName('now_Page')[0].textContent = '1'

  alert('查詢')
}


function removeAllClass(){
  const getAllClass = document.getElementsByClassName('class')
  const maxnum = getAllClass.length
  for(let num = 0; num < maxnum; num++){
      getAllClass[0].remove()
  }
}

function resetClass(){

  document.getElementsByClassName('edit_box')[0].classList.remove('change_color')
  document.getElementsByClassName('edit_remove')[0].classList.add('none')

  nowClass = -1
  document.getElementsByClassName('selecter')[0].classList.add('none')
  document.getElementsByClassName('edit_number')[0].textContent = 'xxxxx'
  document.getElementsByClassName('edit_professor')[0].value = ''
  document.getElementsByClassName('edit_name')[0].value = ''
  document.getElementsByClassName('edit_department')[0].value = ''
  document.getElementsByClassName('edit_content')[0].value = ''
  document.getElementsByClassName('edit_remark')[0].value = ''
  document.getElementsByClassName('edit_url')[0].value = ''
  document.getElementsByClassName('edit_source')[0].value = ''
}