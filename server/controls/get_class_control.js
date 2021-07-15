const {
	getLearnPageClass,
	getDetailPageClass,
	collect,
	rating,
	removeCollect
} = require("../models/get_class_model")

const selectClass = async (req, res) => {

	// get selecter
	let {
		popular,
		source,
		keyword
	} = req.body

	if(!keyword.trim()){
		keyword = "%"
	}else{
		keyword = "%"+keyword+"%"
	}

	if(source === "無"){
		source = "%"
	}

	const page = req.params.page

    
	// catch learn page data and resend
	res.send(await getLearnPageClass(popular, source, keyword, page))
    
}


const getClassDetail = async (req, res) => {
	const userInfo = req.userData
	const number = req.params.number

	res.send(await getDetailPageClass(userInfo, number))
}


const addCollect = async (req, res) => {

	const number = req.body.number
	const userInfo = req.userData

	if(userInfo){
		console.log("用戶: " + userInfo.name +" 將 " + number + "加入了收藏")
		res.send(await collect(number, userInfo))
	}else{
		res.send({data:{msg:"false"}})
	}
    
    
}



const addRating = async (req, res) => {
	const userInfo = req.userData
	const number = req.body.number
	const mark = req.body.mark
	const trueMark = +mark
	if(userInfo){
		res.send(await rating(userInfo, number, trueMark))
	}else{
		res.send({data:{msg:"false"}})
	}
    
}


const deleteCollect = async (req, res) => {
	const collect = req.body.collect
	const userInfo = req.userData

	if(userInfo){
		console.dir(userInfo.name + "將" + collect + "從收藏中移除了")
		res.send(await removeCollect(collect, userInfo))
	}else{
		res.send({data:{msg:"false"}})
	}
    
}


module.exports = {
	selectClass,
	getClassDetail,
	addCollect,
	deleteCollect,
	addRating
}