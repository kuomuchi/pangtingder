console.log('js')

const imageChang = ['../images/homePage1.jpeg', '../images/homePage2.jpeg', '../images/homePage1.jpeg']

setInterval(() => {
  const randomMath = Math.floor(Math.random() * 2) + 1
  console.log(randomMath)
  document.getElementById('home_page_image').src = imageChang[randomMath]
}, 20000)
