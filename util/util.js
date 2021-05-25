const { decod_JWT } = require('../server/models/profile_model')

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
        

module.exports = {
    wrapAsync,
    userStatus
};