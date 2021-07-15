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
		res.send({data:{msg:"success"}})
	}else{
		res.send({data:{msg:"false"}})
	}

}


const ntu = (req, res) => {
	const userInfo = req.userData
	if(userInfo.root === "admin"){
		getClass()
		res.send({data:{msg:"success"}})
	}else{
		res.send({data:{msg:"false"}})
	}
}


const coursera = (req, res) => {
	const userInfo = req.userData
	if(userInfo.root === "admin"){
		getCoursera()
		res.send({data:{msg:"success"}})
	}else{
		res.send({data:{msg:"false"}})
	}
}


const recommend = (req, res) => {
	const userInfo = req.userData
	if(userInfo.root === "admin"){
		upDataRecommend()
		res.send({data:{msg:"success"}})
	}else{
		res.send({data:{msg:"false"}})
	}
}


module.exports = {
	recommend,
	translte,
	ntu,
	coursera
}