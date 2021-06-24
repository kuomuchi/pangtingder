const { 
    sendMsg,
    doingDeleteMsg,
    adminGetUserId,
    servicePost,
    serviceMsgHistiry
} = require('../models/msg_model')


const sendDetailMsg = async (req, res) => {
    const classMsg = req.body;
    const userInfo = req.userData


    if(!userInfo){
        res.send({data:'false'})
        return
    }else if(userInfo.status !== 'normal'){
        res.send({data:'ban'})
        return
    }

    const sendData = [classMsg.class_number, userInfo.id, userInfo.name, classMsg.msg]

    await sendMsg(sendData)
    res.send({data:'success'})
    
}

const deleteDetailMsg = async (req, res) => {
    const userInfo = req.userData
    const deleteMsg = req.body

    if(userInfo.id === deleteMsg.user_id || userInfo.root){
        const package = [deleteMsg.number, deleteMsg.user_id, deleteMsg.class_msg]
        res.send(await doingDeleteMsg(package))
        return
    }

    res.send({data:'false'})
    
}

const serviceData = async (req, res) => {

    const userData = req.userData
    console.log(userData)

    if(userData){
        const package = [userData.id, userData.id]
        const histiryMsg = await serviceMsgHistiry(package)
        const reSend = [histiryMsg, userData]

        if(userData.root === 'admin'){
            reSend.push(await adminGetUserId())
        }

        res.send(reSend)

    }else{
        const resend = {
            data: 'failure'
        }
        res.send(resend)
    }
    
}


const servicePostMsg = async (req, res) => {
    const userData = req.userData

    let nowTime = new Date().toLocaleString('zh-TW');

    const sendDB = []
    sendDB.push(userData.name)
    sendDB.push(userData.id)
    sendDB.push(req.body.sendTo)
    sendDB.push(req.body.content)
    sendDB.push(nowTime)
    
    await servicePost(sendDB)

    if(userData){
        res.send(userData)
    }else{
        const resend = {
            data: 'failure'
        }
        res.send(resend)
    }
    
}


module.exports = {
    sendDetailMsg,
    serviceData,
    servicePostMsg,
    deleteDetailMsg
}