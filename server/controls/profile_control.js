const { 
	addpass,
	create_JWT_token,
} = require("../models/profile_model")

const { query } = require("../models/mysql_model")

const profile = async (req, res) => {

	const password = req.body.password
	const email = req.body.email
	const getSafe = await addpass(password) //password encryption


	let sql = "SELECT id, user_name, password, root, status FROM account WHERE email = ?"
	const getEmail = await query(sql, email)
	const haveEmail = JSON.parse(JSON.stringify(getEmail))[0]


	//INSERT INTO `pangtingder`.`account` (`user_name`, `email`, `password`, `root`, `status`) VALUES ('admin', 'admin', 'admin', 'admin', 'admin');


	const userJwt = {
		name: "",
		email: "",
		id: "",
		root: "",
		status: ""
	}

	// signup
	if(req.body.name){
		if(haveEmail){
			res.send({data:{msg:"failure_signup"}})
		}else{
			const createNewUser = []
			createNewUser.push(req.body.name)
			createNewUser.push(email)
			createNewUser.push(getSafe)

			sql = "INSERT INTO account (`user_name`, `email`, `password`, `root`, `status`) VALUES (?, ?, ?, 'user', 'normal')"
			await query(sql, createNewUser)

			sql = "SELECT id, root, status FROM account WHERE email = ?"
			const userId = await query(sql, email)
			const userData = JSON.parse(JSON.stringify(userId))[0]


			userJwt.name = req.body.name
			userJwt.email = email
			userJwt.id = userData.id
			userJwt.root = userData.root
			userJwt.status = userData.status


			const jwt =  await create_JWT_token(userJwt)
			res.send({data:{msg:"success", token: jwt}})
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
				res.send({data:{msg:"success", token: jwt}})
			}else{
				res.send({data:{msg:"failure_login"}})
			}

		} catch (error) {
			res.send({data:{msg:"nano"}})
		}

        
	}
    
}

const  getProfileData = async (req, res) => {

	let resend = req.userData

	// if jwt is expired
	if(!resend){
		resend = {msg:"false"}
		console.log("jwt過期")
		res.send({data:resend})
		return
	}

	let userCollect = await query(`SELECT class_number FROM collect where user_id = '${resend.id}'`)
	userCollect = JSON.parse(JSON.stringify(userCollect))

	const allCollectNumber = []
	let userCollectClass

	// if have collect, insert it
	if(userCollect.length){
		for(let i=0; i<userCollect.length; i++){
			allCollectNumber.push(userCollect[i].class_number)
		}
    
		let sql = "SELECT * FROM class WHERE number in (?)"
    
		userCollectClass = await query(sql, [allCollectNumber])
		userCollectClass = JSON.parse(JSON.stringify(userCollectClass))
	}

	res.send({data:[resend, userCollectClass]})
}

module.exports = {
	profile,
	getProfileData
}