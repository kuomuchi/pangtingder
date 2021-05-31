const { 
    addpass,
    create_JWT_token,
    decod_JWT
} = require('../models/profile_model')

const { query } = require('../models/mysql_model')

const profile = async (req, res) => {

    const password = req.body.password
    const email = req.body.email
    const getSafe = await addpass(password) //密碼加密


    let sql = 'SELECT id, user_name, password, root, status FROM account WHERE email = ?'
    const getEmail = await query(sql, email)
    const haveEmail = JSON.parse(JSON.stringify(getEmail))[0]

    console.log(haveEmail)


    //INSERT INTO `pangtingder`.`account` (`user_name`, `email`, `password`, `root`, `status`) VALUES ('admin', 'admin', 'admin', 'admin', 'admin');


    const userJwt = {
        name: '',
        email: '',
        id: '',
        root: '',
        status: ''
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

            sql = 'SELECT id, root, status FROM pangtingder.account WHERE email = ?'
            const userId = (sql, email)
            const userData = JSON.parse(JSON.stringify(userId))

            userJwt.name = req.body.name
            userJwt.email = email
            userJwt.id = userData.id
            userJwt.root = userData.root
            userJwt.status = userData.status
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
                userJwt.root = haveEmail.root
                userJwt.status = haveEmail.status

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

    let resend = req.userData

    console.log(resend)


    // 如果沒有東西，就直接消失！
    if(!resend){
        resend = {msg:'false'}
        console.log('jwt過期')
        res.send({data:resend})
        return
    }

    let userCollect = await query(`SELECT class_number FROM pangtingder.collect where user_id = '${resend.id}'`)
    userCollect = JSON.parse(JSON.stringify(userCollect))

    const allCollectNumber = []
    let userCollectClass

    // 如果有收藏，將收藏整理起來，傳送到前端。
    if(userCollect.length){
        for(let i=0; i<userCollect.length; i++){
            allCollectNumber.push(userCollect[i].class_number)
        }
    
        sql = 'SELECT * FROM pangtingder.class WHERE number in (?)'
    
        userCollectClass = await query(sql, [allCollectNumber])
    
        userCollectClass = JSON.parse(JSON.stringify(userCollectClass))

    }

    res.send({data:[resend, userCollectClass]})
}

module.exports = {
    profile,
    getProData
}