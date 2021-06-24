const { decod_JWT } = require('../server/models/profile_model')
const { query } = require('../server/models/mysql_model')

const wrapAsync = (fn) => {
    return function(req, res, next) {
        
        try {
            fn(req, res)
        } catch (error) {
            fn(next)
        }
    };
};

const userStatus = () => {
    return async function (req, res, next) {
        let accessToken = req.get('Authorization'); // 這個厲害：Ｄ
        accessToken = accessToken.split('Bearer ')[1]
        accessToken = await decod_JWT(accessToken)

        try {
            if(accessToken){
                req.userData = accessToken
            }else{
                req.userData = 0
            }
        } catch (error) {
            req.userData = 0
        }
        
        next()
        return
    }
}

const getNowStatus = async (work) => {
    let data = await query(`SELECT run FROM auto_work WHERE work = '${work}'`)
    data = JSON.parse(JSON.stringify(data))
    return data[0].run
}

const starEvent = async (work) => {
    await query(`UPDATE auto_work SET run = 1 WHERE work = '${work}'`)

    // updata time
    let nowTime = new Date().toLocaleString('zh-TW');
    let setTime = `UPDATE auto_work SET time = ? WHERE work = '${work}';`
    await query(setTime, nowTime)

}
        

module.exports = {
    wrapAsync,
    userStatus,
    getNowStatus,
    starEvent
};