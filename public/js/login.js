console.log('js')

let stauts = 0;

if(window.localStorage.getItem('account_token')){
    console.log('get')
    window.location.href ="/profile.html"
}


// 切換
document.getElementById('change_box').addEventListener('click', ()=>{
    if(stauts === 0){
        stauts = 1
        console.log(stauts)
        document.getElementById('userName_box').style.display = 'flex'

        document.getElementsByClassName('change_button')[0].textContent = '已有帳號？點擊登入'

        document.getElementsByClassName('login_box')[0].classList.add('change_color')

        document.getElementsByClassName('login_title')[0].textContent = 'SignUp'

        document.getElementsByClassName('sign_box')[0].textContent = '註冊'

    }else{
        stauts = 0
        console.log(stauts)
        document.getElementById('userName_box').style.display = 'none'

        document.getElementsByClassName('change_button')[0].textContent = '沒有帳號、註冊'

        document.getElementsByClassName('login_box')[0].classList.remove('change_color')

        document.getElementsByClassName('sign_box')[0].textContent = '登入'

        document.getElementsByClassName('login_title')[0].textContent = 'Login'

        document.getElementById('name').value = ''
    }
})



document.getElementsByClassName('sign_box')[0].addEventListener('click' ,() => {

    const password = document.getElementById('password').value
    const email = document.getElementById('email').value
    const name = document.getElementById('name').value

    if(stauts === 0 && password.trim() && email.trim() || stauts === 1 && name.trim() && password.trim() && email.trim()){
        const xhr = new XMLHttpRequest()
        let userData = {
            name: '',
            email: email,
            password: password
        }

        if(stauts === 1){
            userData.name = name
        }

        console.log(userData)

        userData = JSON.stringify(userData)
        

        xhr.open('POST', '/profile', true)
        xhr.setRequestHeader("Content-Type", "application/json");


        xhr.onreadystatechange = function () {
            if(xhr.readyState == 4 && xhr.status == 200){
                let getData = "";
                getData = xhr.responseText;
                getData = JSON.parse(getData)
                switch(getData.msg){
                    case 'success':
                        window.localStorage.setItem('account_token', getData.token)
                        alert('登入成功')
                        window.location.href = '/profile.html'
                        break
                    case 'failure_login':
                        alert('密碼錯誤')
                        break
                    case 'nano':
                        alert('沒有註冊帳號')
                        break
                    case 'failure_signup':
                        alert('重複的email')
                        break
                    default:
                        break
                }

            }
        }


        // 將input清除
        document.getElementById('password').value = ''
        document.getElementById('email').value = ''
        document.getElementById('name').value = ''


        xhr.send(userData)
    }else{
        alert('資料沒有輸入完整')
    }

})