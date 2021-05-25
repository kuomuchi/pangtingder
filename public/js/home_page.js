// 查看是否有登入
if(!window.localStorage.getItem('account_token')){
  document.getElementsByClassName('top_login')[0].style.display = ''
  document.getElementsByClassName('top_login_icon')[0].style.display = 'none'

  document.querySelectorAll('.top_box_right > a')[1].href = './login.html'
}else{
  document.getElementsByClassName('top_login')[0].style.display = 'none'
  document.getElementsByClassName('top_login_icon')[0].style.display = ''

  document.querySelectorAll('.top_box_right > a')[1].href = './profile.html'
}


const imageChang = ['../images/homePage1.jpeg', '../images/homePage2.jpeg', '../images/homePage1.jpeg']

setInterval(() => {
  const randomMath = Math.floor(Math.random() * 2) + 1
  console.log(randomMath)
  document.getElementById('home_page_image').src = imageChang[randomMath]
}, 20000)


