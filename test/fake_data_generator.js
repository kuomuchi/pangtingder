require("dotenv").config()
const { query } = require("../server/models/mysql_model")

const truncateTable = async () => {


	console.log("clear table")
	const table = ["account", "auto_work", "class", "collect", "detail_msg", "professor", "recommend", "service", "user_rating", "web_comment"]
	for(let num = 0; num < table.length; num++){
		query(`TRUNCATE TABLE ${table[num]}`)
	}

	return 1

}

const createAccount = () => {

	console.log("create new user")

	const fakeUser = [
		{
			user_name: "testAdmin",
			email: "testAdmin",
			password: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
			root: "admin",
			status: "normal"
		},

		{
			user_name: "testUser",
			email: "testUser",
			password: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
			root: "user",
			status: "normal"
		}
	]
	return query("INSERT INTO account (user_name, email, password, root, status) VALUES ?", [fakeUser.map(x => Object.values(x))])
}


const cretaeAutoWork = async () => {

	console.log("create event")
	const fakeEvent = [
		{
			work:"coursera",
			time:"",
			status:"0",
			run:"0",
			msg: ""

		},
		{
			work:"fixrating",
			time:"",
			status:"0",
			run:"0",
			msg: ""

		},
		{
			work:"fixweb",
			time:"",
			status:"0",
			run:"0",
			msg: ""

		},
		{
			work:"ntu",
			time:"",
			status:"0",
			run:"0",
			msg: ""

		},
		{
			work:"recommend",
			time:"",
			status:"0",
			run:"0",
			msg: ""

		},
		{
			work:"translate",
			time:"",
			status:"0",
			run:"0",
			msg: ""

		}
	]

	return query("INSERT INTO auto_work (work, time, status, run, msg) VALUES ?", [fakeEvent.map(x => Object.values(x))])
    
}

const createClass = () => {
	console.log("create fake class")
	const fakeClass = [
		{
			number:"test",
			class_name:"test",
			department:"all",
			professor:"admin",
			source:"test",
			remarks:"test",
			web_url:"/",
			class_content:"\ntest",
			content_translate:"\ntest",
			mark:"3.5",
			image:""
		},
		{
			number:"test2",
			class_name:"test2",
			department:"all",
			professor:"admin",
			source:"test",
			remarks:"test2",
			web_url:"/",
			class_content:"\ntest2",
			content_translate:"\ntest2",
			mark:"2",
			image:""
		}
	]
	return query("INSERT INTO class (number, class_name, department, professor, source, remarks, web_url, class_content, content_translate, mark, image) VALUES ?", [fakeClass.map(x => Object.values(x))])
}

const createDetailMsg = () => {
	console.log("create fake Detail msg")
	const fakeDetilMsg = [
		{
			class_number:"test",
			user_id:"1",
			user_name:"testAdmin",
			class_msg:"this is test"
		},
		{
			class_number:"test",
			user_id:"2",
			user_name:"testUser",
			class_msg:"this is test too"
		}   
	]

	return query("INSERT INTO detail_msg (class_number, user_id, user_name, class_msg) VALUES ?", [fakeDetilMsg.map(x => Object.values(x))])
}

const createProfessor = () => {
	console.log("create fake professor")
	const fakeProfessor =[
		{
			source:"test",
			professor:"admin",
			email:"",
			mark:"5"
		}
	]
	return query("INSERT INTO professor (class_number, user_id, user_name, class_msg) VALUES ?", [fakeProfessor.map(x => Object.values(x))])
}

const createService = () => {
	console.log("create fake service history")
	const fakeHistory = [
		{
			user_name:"testUser",
			user_id:"2",
			sendTo:"admin",
			content:"send to admin",
			time:""
		},
		{
			user_name:"testAdmin",
			user_id:"1",
			sendTo:"2",
			content:"send to user",
			time:""
		}
	]

	return query("INSERT INTO service (user_name, user_id, sendTo, content, time) VALUES ?", [fakeHistory.map(x => Object.values(x))])
}

const createWebMark = () => {
	console.log("create fake webMark")
	const fakeWebMark = [
		{
			web:"tts",
			class_name:"test",
			professor:"admin",
			mark:"3",
			source:"admin"
		},
		{
			web:"tts",
			class_name:"test2",
			professor:"admin",
			mark:"4",
			source:"admin"
		}
        
	]
	return query("INSERT INTO web_comment (web, class_name, professor, mark, source) VALUES ?", [fakeWebMark.map(x => Object.values(x))])

}


const createFakeData = async () => {

	createAccount()
	cretaeAutoWork()
	createClass()
	createDetailMsg()
	createProfessor()
	createService()
	createWebMark()

	return 1

}




module.exports = {
	truncateTable,
	createAccount,
	cretaeAutoWork,
	createClass,
	createDetailMsg,
	createProfessor,
	createService,
	createWebMark,
	createFakeData
}