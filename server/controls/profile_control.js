const { 
    addpass,
    create_JWT_token,
    decod_JWT
} = require('../models/profile_model')

const { query } = require('../models/mysql_model')

const profile = async (req, res) => {
    console.log(req.body)

    const password = req.body.password
    const email = req.body.email
    const getSafe = await addpass(password) //密碼加密


    let sql = 'SELECT id, password, user_name FROM account WHERE email = ?'
    const getEmail = await query(sql, email)
    const haveEmail = JSON.parse(JSON.stringify(getEmail))[0]

    console.log(haveEmail)


    //INSERT INTO `pangtingder`.`account` (`user_name`, `email`, `password`, `root`, `status`) VALUES ('admin', 'admin', 'admin', 'admin', 'admin');


    const userJwt = {
        name: '',
        email: '',
        id: ''
    }

    // 註冊
    if(req.body.name){
        if(haveEmail){
            res.send({msg:'failure_signup'})
        }else{
            const createNewUser = []
            createNewUser.push(req.body.name)
            createNewUser.push(email)
            createNewUser.push(getSafe)

            sql = "INSERT INTO pangtingder.account (`user_name`, `email`, `password`, `root`, `status`) VALUES (?, ?, ?, 'user', 'normal')"
            await query(sql, createNewUser)

            sql = 'SELECT id FROM pangtingder.account WHERE email = ?'
            const userId = (sql, email)
            console.log(userId)

            userJwt.name = req.body.name
            userJwt.email = email
            userJwt.id = userId
            const jwt =  await create_JWT_token(userJwt)
            res.send({msg:'success', token: jwt})
        }
        
    }else{
        // 登入
        try {
            if(haveEmail.password === getSafe){
                userJwt.name = haveEmail.user_name
                userJwt.email = email
                userJwt.id = haveEmail.id
                const jwt =  await create_JWT_token(userJwt)
                res.send({msg:'success', token: jwt})
            }else{
                res.send({msg:'failure_login'})
            }

        } catch (error) {
            res.send({msg:'nano'})
        }

        
    }
    
}

async function getProData(req, res){ // getProData
    let getToken = req.headers.authorization
    account_token = getToken.split('Bearer ')[1]
    let resend = ''


    const resendData = await decod_JWT(account_token) //解碼Token 並且回傳
    resend = resendData

    // 如果沒有東西，就直接消失！
    if(!resend){
        resend = {msg:'false'}
        console.log('jwt過期')
        res.send({data:resend})
        return
    }


    let userCollect = await query(`SELECT class_number FROM pangtingder.collect where email = '${resend.email}'`)
    userCollect = JSON.parse(JSON.stringify(userCollect))
    // console.log(userCollect)

    const allCollectNumber = []

    for(let i=0; i<userCollect.length; i++){
        allCollectNumber.push(userCollect[i].class_number)
    }

    

    sql = 'SELECT * FROM pangtingder.class WHERE number in (?)'

    let userCollectClass = await query(sql, [allCollectNumber])

    userCollectClass = JSON.parse(JSON.stringify(userCollectClass))


    res.send({data:[resend, userCollectClass]})
}

module.exports = {
    profile,
    getProData
}