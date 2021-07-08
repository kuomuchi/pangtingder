const { 
	upDataRecommend
} = require("../models/recommend_model")

const { getClass } = require("../crawlers/ntu_crawlers/ntu_class")

const { translteModel } = require("../models/translate_model")

const { getCoursera } = require("../crawlers/coursera_crawlers/coursera_class")


const translte = (req, res) => {
	const userInfo = req.userData

	if(userInfo.root === "admin"){
		translteModel()
		res.send("yes")
	}else{
		res.send("false")
	}

}


const ntu = (req, res) => {
	const userInfo = req.userData
	if(userInfo.root === "admin"){
		getClass()
		res.send("yes")    
	}else{
		res.send("false")
	}
}


const coursera = (req, res) => {
	const userInfo = req.userData
	if(userInfo.root === "admin"){
		getCoursera()
		res.send("yes")
	}else{
		res.send("false")
	}
}


const recommend = (req, res) => {
	const userInfo = req.userData
	if(userInfo.root === "admin"){
		upDataRecommend()
		res.send("yes")
	}else{
		res.send("false")
	}
}


module.exports = {
	recommend,
	translte,
	ntu,
	coursera
}