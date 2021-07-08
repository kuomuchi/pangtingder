const { 
	translateText
} = require("./recommend_model")

const { 
	getNowStatus,
	starEvent
} = require("../../util/util")


const { query } = require("./mysql_model")

const translteModel = async () => {
    
	let getAutoStatus = await query("SELECT time, status, run FROM auto_work WHERE work = 'translate'")
	const getRun = JSON.parse(JSON.stringify(getAutoStatus))[0].run
	const getStatus = JSON.parse(JSON.stringify(getAutoStatus))[0].status

	console.log(getRun)

	if(getStatus){
		if(!+getRun){

			starEvent("translate")

			const getClass = await query("SELECT id, class_content, content_translate FROM class WHERE content_translate IS NULL")
			const sortData = JSON.parse(JSON.stringify(getClass))
			const max = sortData.length
			console.log(max)


			let timesRun = 0 // how many times main function are runing.

			// recursive, take care function。
            
			async function main(){
				console.log("現在是:" + sortData[timesRun].id)

				if(timesRun % 5 === 0){
					let checkPoint = await getNowStatus()
					if(!+checkPoint){
						console.log("從外部被關閉")
						return
					}
				}

				// if not translate yet, translate it
				if(!sortData[timesRun].content_translate && sortData[timesRun].class_content){

					// translate
					const resutl = await translateText(sortData[timesRun].class_content)

					if(resutl === 0 || resutl === undefined){
						console.log("壞掉 " + sortData[timesRun].id)
						console.log("google-Api爆氣")

						const msg = "壞掉 " + sortData[timesRun].id
						await query("UPDATE auto_work SET msg = ?, run = 0 WHERE work = 'translate'", msg)
						return

					}else{

						let sql = "UPDATE class SET `content_translate` = ? WHERE (id = ?)"
						const data = [resutl, sortData[timesRun].id]
						await query(sql, data)


						timesRun++
						setTimeout( ()=> {
							main()
						}, 1500)
					}
                    
				}else{
					console.log("這裡不需要翻譯")
					timesRun++
					setTimeout( () => {
						main()
					}, 100)
				}
                
				if(timesRun >= max){
					await query("UPDATE auto_work SET run = 0 WHERE (work = 'translate')")
					console.log("end，全部翻譯完")
					return
				}

			}

			main()

		}else{
			console.log("事件正在執行")
			return
		}
	}else{
		console.log("translate功能 狀態為null")
		return
	}

}

module.exports = {
	translteModel
}