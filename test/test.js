require("dotenv").config()
const { dbDatabase } = process.env

const chai = require("chai")
const app = require("../index")
const chaiHttp = require("chai-http")
chai.use(chaiHttp)


const requester = chai.request(app).keepOpen()
const assert = chai.assert

const {
	truncateTable,
	createFakeData
} = require("./fake_data_generator")




before( async () => {

	console.log("now databases: "+ dbDatabase)
	if (dbDatabase !== "test"){
		throw new Error("warning databases is not 「test」")
	}else{
		console.log("greate!")

		it("clear DB", async () => {
			const resend = await truncateTable()
			assert.strictEqual(resend, 1)
		})

		it("create fake data", async () => {
			const resend =  await createFakeData()

			assert.strictEqual(resend, 1)
  
		})

	}
})


describe("test util tool", function() {
	const util = require("../util/util")

	it("get ntu status", async () => {
    
		const input = "ntu"
		const testGetStatus = await util.getNowStatus(input)

		assert.strictEqual(+testGetStatus, 0)

	})

	it("start auto event", async () => {
    
		const input = "ntu"

		await util.starEvent(input)
		const testGetStatus = await util.getNowStatus(input)

		assert.strictEqual(+testGetStatus, 1)

	})

	it("get coursera status", async () => {
    
		const input = "coursera"
		const testGetStatus = await util.getNowStatus(input)

		assert.strictEqual(+testGetStatus, 0)

	})
})



describe("Get account", function() {
	this.timeout(5000)
	let token = "Bearer "

	it("Login in", async () => {

		const input = {name:"",email:"testAdmin",password:"123456"}
		const res = await requester
			.post("/profile")
			.send(input)
		token += res.body.token
		assert.strictEqual(res.body.msg, "success")

	})

	it("Sign up", async () => {

		const input = {name:"test3",email:"testUser3",password:"123456"}

		const res = await requester
			.post("/profile")
			.send(input)

		assert.strictEqual(res.body.msg, "success")

	})


	it("failure sign up", async () => {

		const input = {name:"test3",email:"testUser3",password:"123456"}
		const res = await requester
			.post("/profile")
			.send(input)
    
		assert.strictEqual(res.body.msg, "failure_signup")

	})

	it("failure login in", async () => {

		const input = {name:"",email:"testUser3",password:"123321"}

		const res = await requester
			.post("/profile")
			.send(input)
    
		assert.strictEqual(res.body.msg, "failure_login")

	})

	it("get profile", async () => {

		const input = token

		const res = await requester
			.get("/profile")
			.set("Authorization", input)

		const userDataResend = res.body.data[0]

		const userData = {
			name: userDataResend.name,
			email: userDataResend.email,
			id: userDataResend.id,
			root: userDataResend.root,
			status: userDataResend.status
		}

		const checkData = {
			name: "testAdmin",
			email: "testAdmin",
			id: 1,
			root: "admin",
			status: "normal",
		}
    
		assert.strictEqual(JSON.stringify(userData), JSON.stringify(checkData))

	})

	it("failure get profile", async () => {

		const input = "null"

		const res = await requester
			.get("/profile")
			.set("Authorization", input)

		const resend = res.body.data.msg
		const checkData = "false"
    
		assert.strictEqual(resend, checkData)

	})

})


describe("Get class", function() {

	this.timeout(5000)

	it("get learnPageClass", async () => {

		const input = {popular:"無", source:"無", keyword:""}
		const page = 0
		const res = await requester
			.post("/learnpage/"+page)
			.send(input)

		const compare = (res.body.length > 1)
		assert.strictEqual(compare, true)

	})

	it("404 learnPageClass", async () => {

		const input = {popular:"無", source:"無", keyword:""}
		const page = 1
		const res = await requester
			.post("/learnpage/"+page)
			.send(input)

		const compare = (res.body.length === 1)
		assert.strictEqual(compare, true)

	})

  
})


describe("Get class detail", async () => {

	let token = "Bearer "
	let userId = 0
	it("Login get toke", async () => {
		const input = {name:"",email:"testAdmin",password:"123456"}
		const res = await requester
			.post("/profile")
			.send(input)

		token += res.body.token
		userId = 1
		assert.strictEqual(res.body.msg, "success")
	})

	it("get class detail", async () => {
		const input = "null"
		const classId = "test"
		const res = await requester
			.get("/detail/" + classId)
			.set("Authorization", input)

		const checkData = {
			id: 1,
			number: "test",
			class_name: "test",
			department: "all",
			professor: "admin",
			source: "test",
			remarks: "test",
			web_url: "/",
			class_content: "\ntest",
			content_translate: "\ntest",
			mark: "3.5",
			image: ""
		}
		assert.strictEqual(JSON.stringify(res.body[0]), JSON.stringify(checkData))
	})


	it("not logged class detail", async () => {
		const input = "null"
		const classId = "test"
		const res = await requester
			.get("/detail/" + classId)
			.set("Authorization", input)
		const resend = res.body[1].userId
		const noUser = 0

		assert.strictEqual(resend, noUser)
	})


	it("login class detail", async () => {
		const input = token
		const classId = "test"

		const res = await requester
			.get("/detail/" + classId)
			.set("Authorization", input)

		const resend = res.body[1].userId

		assert.strictEqual(resend, userId)
	})

	it("userAdmin add collect", async () => {
		const input = {number:"test"}
		const getToken = token

		const res = await requester
			.post("/collect")
			.set("Authorization", getToken)
			.set("Content-Type","application/json")
			.send(input)
		const resend = res.body.data
		const compare = "success"
    
		assert.strictEqual(resend, compare)
	})

	it("userAdmin add collect fail", async () => {
		const input = {number:"test"}
		const getToken = "null"

		const res = await requester
			.post("/collect")
			.set("Authorization", getToken)
			.set("Content-Type","application/json")
			.send(input)
		const resend = res.body.data
		const compare = "false"
    
		assert.strictEqual(resend, compare)
	})


	it("userAdmin add reting", async () => {
		const input = {number:"test", mark: "4"}
		const getToken = token

		const res = await requester
			.post("/rating")
			.set("Authorization", getToken)
			.set("Content-Type","application/json")
			.send(input)
		// const resend = res.body.data
		// const compare = 'success'
		const resend = res.body.msg
		const compare = "success"
    
		assert.strictEqual(resend, compare)
	})

	it("userAdmin add reting fail", async () => {
		const input = {number:"test", mark: "4"}
		const getToken = "null"

		const res = await requester
			.post("/rating")
			.set("Authorization", getToken)
			.set("Content-Type","application/json")
			.send(input)
		// const resend = res.body.data
		// const compare = 'success'
		const resend = res.body.data
		const compare = "false"
    
		assert.strictEqual(resend, compare)
	})


	it("userAdmin delete collect", async () => {
		const input = {collect:"test"}
		const getToken = token

		const res = await requester
			.delete("/collect")
			.set("Authorization", getToken)
			.set("Content-Type","application/json")
			.send(input)
    
		const resend = res.body.data
		const compare = "success"
    
		assert.strictEqual(resend, compare)
	})

	it("userAdmin delete collect fail", async () => {
		const input = {collect:"test"}
		const getToken = "null"

		const res = await requester
			.delete("/collect")
			.set("Authorization", getToken)
			.set("Content-Type","application/json")
			.send(input)
    
		const resend = res.body.data
		const compare = "false"
    
		assert.strictEqual(resend, compare)
	})

	it("userAdmin add message", async () => {
		const input = {class_number:"test", msg:"test nice"}
		const getToken = token

		const res = await requester
			.post("/classMsg")
			.set("Authorization", getToken)
			.set("Content-Type","application/json")
			.send(input)
    
		const resend = res.body.data
		const compare = "success"
		assert.strictEqual(resend, compare)
	})

	it("userAdmin add message fail token", async () => {
		const input = {class_number:"test", msg:"test nice"}
		const getToken = "null"

		const res = await requester
			.post("/classMsg")
			.set("Authorization", getToken)
			.set("Content-Type","application/json")
			.send(input)
    
		const resend = res.body.data
		const compare = "false"
		assert.strictEqual(resend, compare)
	})


	it("userAdmin delete message", async () => {
		const input = {number:"test", class_msg:"this is test", user_id: userId}
		const getToken = token

		const res = await requester
			.delete("/classMsg")
			.set("Authorization", getToken)
			.set("Content-Type","application/json")
			.send(input)
    
		const resend = res.body.data
		const compare = "success"
		assert.strictEqual(resend, compare)
	})

	it("userAdmin delete message fail msg", async () => {
		const input = {number:"test", class_msg:"thisdfs is sdftest", user_id: userId}
		const getToken = token

		const res = await requester
			.delete("/classMsg")
			.set("Authorization", getToken)
			.set("Content-Type","application/json")
			.send(input)
    
		const resend = res.body.data
		const compare = "success"
		assert.strictEqual(resend, compare)
	})

	it("userAdmin delete message fail token", async () => {
		const input = {number:"test", class_msg:"this is test", user_id: userId}
		const getToken = "null"

		const res = await requester
			.delete("/classMsg")
			.set("Authorization", getToken)
			.set("Content-Type","application/json")
			.send(input)
    
		const resend = res.body.data
		const compare = "false"
		assert.strictEqual(resend, compare)
	})

})
