const { query } = require("../models/mysql_model")

const { 
	starEvent,
	getNowStatus
} = require("../../util/util")

const webMarkCalculate = (allClass, getWebMark, calculation) => {

	let length = getWebMark.length

	for(let num = 0; num < length; num++){
		for(let i = 0; i< allClass.length; i++){

			// if select same name crosues who mark's is not null += mark, and ++ time
			// else set course mark = mark and set time = 1

			if(allClass[i].class_name.trim() == getWebMark[num].class_name.trim()){

				if(allClass[i].mark){
					allClass[i].mark += +getWebMark[num].mark
				}else{
					allClass[i].mark = +getWebMark[num].mark
					calculation.push(i)
				}

				if(allClass[i].time){
					allClass[i].time++
				}else{
					allClass[i].time = 1
				}
				break
			}

		}
	}

}


const professorMarkCalculate = (allClass, getProfessorMark, calculation) => {
	let length = getProfessorMark.length

	for(let num = 0; num < length; num++){
		for(let i = 0; i< allClass.length; i++){

			if(allClass[i].professor.trim() == getProfessorMark[num].professor.trim()){

				if(allClass[i].mark){
					allClass[i].mark += +getProfessorMark[num].mark
				}else{
					allClass[i].mark = +getProfessorMark[num].mark
					calculation.push(i)
				}

				if(allClass[i].time){
					allClass[i].time++
				}else{
					allClass[i].time = 1
				}
				break
			}

		}
	}

}


const accountMarkCalculate = (allClass, getAccountMark, calculation) => {

	let length = getAccountMark.length

	for(let num = 0; num < length; num++){
		for(let i = 0; i< allClass.length; i++){
            
			if(allClass[i].number.trim() == getAccountMark[num].class_number.trim()){

				if(allClass[i].mark){
					allClass[i].mark += +getAccountMark[num].mark
				}else{
					allClass[i].mark = +getAccountMark[num].mark
					calculation.push(i)
				}

				if(allClass[i].time){
					allClass[i].time++
				}else{
					allClass[i].time = 1
				}
				break
			}

		}
	}

}


const calculateAllMark = async (calculation, allClass) => {
	for(let num=0; num < calculation.length; num++){
		console.log(num)
		const updata =  calculation[num]

		allClass[updata].mark = allClass[updata].mark / allClass[updata].time

		if(allClass[updata].mark > 5){
			allClass[updata].mark = 5
		}

		allClass[updata].mark = allClass[updata].mark.toFixed(1)
		const packae = [allClass[updata].mark, allClass[updata].number]
		let sql = "UPDATE class SET mark = ? WHERE number = ?"
		await query(sql, packae)

		if(num % 3 === 0){
			//檢查目前run的狀況
			let checkPoint = await getNowStatus("fixrating")
			if(!+checkPoint){
				console.log("從外部被關閉")
				return
			}
		}
	}
}

const upDataRating = async (admin) => {

	const getDB = await query("SELECT time, status, run FROM auto_work WHERE work = 'fixrating'")
	const getStatus = JSON.parse(JSON.stringify(getDB))[0].status
	const getRun = JSON.parse(JSON.stringify(getDB))[0].run

	if(getStatus){
		if(!+getRun){

			// star updata
			if(admin){

				starEvent("fixrating")

				const calculation = []

				// get web rating
				let data = await query("SELECT class_name, mark FROM web_comment;")
				const getWebMark = JSON.parse(JSON.stringify(data))

				// get account rating
				data = await query("SELECT class_number, mark FROM user_rating")
				const getAccountMark = JSON.parse(JSON.stringify(data))


				// get professor rating
				data = await query("SELECT professor, mark FROM professor")
				const getProfessorMark = JSON.parse(JSON.stringify(data))


				// get all course in self web
				data = await query("SELECT number, class_name, professor FROM class")
				const allClass = JSON.parse(JSON.stringify(data))

				// calculate "class name" mark
				await webMarkCalculate(allClass, getWebMark, calculation)

				let checkPoint = await getNowStatus("fixrating")
				if(!+checkPoint){
					console.log("從外部被關閉")
					return
				}

				// calculate "professor" mark
				await professorMarkCalculate(allClass, getProfessorMark, calculation)
				checkPoint = await getNowStatus("fixrating")
				if(!+checkPoint){
					console.log("從外部被關閉")
					return
				}

				// calculate "account" mark
				await accountMarkCalculate(allClass, getAccountMark, calculation)
				checkPoint = await getNowStatus("fixrating")
				if(!+checkPoint){
					console.log("從外部被關閉")
					return
				}

				await calculateAllMark (calculation, allClass)
				await query("UPDATE auto_work SET run = 1 WHERE work = 'fixrating'")


				console.log("end")
				return
                
			}else{
				console.log("not admin")
				return
			}

		}else{
			console.log("事件正在執行")
			return
		}
        
	}else{
		console.log("rating功能 狀態為null")
		return
	}

}

module.exports = {
	upDataRating
}