const fetch = require("node-fetch")
const cheerio = require("cheerio")

const { query } = require("../../models/mysql_model.js")

const { 
	getNowStatus,
	starEvent
} = require("../../../util/util")

const getCourseraPageContent = async (num) =>{
	const body = `{"requests":[{"indexName":"DO_NOT_DELETE_PLACEHOLDER_INDEX_NAME","params":"query=free&page=0&highlightPreTag=%3Cais-highlight-0000000000%3E&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&clickAnalytics=true&facets=%5B%5D&tagFilters="},{"indexName":"test_all_products_term_optimization_ai_reranking","params":"query=free&hitsPerPage=20&maxValuesPerFacet=500&page=${num}&highlightPreTag=%3Cais-highlight-0000000000%3E&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&clickAnalytics=true&ruleContexts=%5B%22zh%22%5D&facets=%5B%22allLanguages%22%2C%22productDifficultyLevel%22%2C%22productDurationEnum%22%2C%22topic%22%2C%22skills%22%2C%22partners%22%2C%22entityTypeDescription%22%5D&tagFilters="},{"indexName":"test_suggestions","params":"query=free&page=0&highlightPreTag=%3Cais-highlight-0000000000%3E&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&clickAnalytics=true&facets=%5B%5D&tagFilters="}]}`

	const classContent = await fetch("https://lua9b20g37-1.algolianet.com/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%20(lite)%203.30.0%3Breact-instantsearch%205.2.3%3BJS%20Helper%202.26.1&x-algolia-application-id=LUA9B20G37&x-algolia-api-key=dcc55281ffd7ba6f24c3a9b18288499b", {
		"referrer": "https://www.coursera.org/",
		"referrerPolicy": "strict-origin-when-cross-origin",
		"body": body,
		"method": "POST",
		"mode": "cors"
	})

	return await classContent.json()
}


const getCoursera = async () => {

	const getAutoStatus = await query("SELECT time, status, run FROM auto_work WHERE work = 'coursera'")
	const getRun = JSON.parse(JSON.stringify(getAutoStatus))[0].run
	const getStatus = JSON.parse(JSON.stringify(getAutoStatus))[0].status

	if(getStatus){
		if(!+getRun){

			starEvent("coursera")

			const getAllClass = JSON.parse(JSON.stringify(await query("SELECT number FROM class WHERE number like 'course%'")))
			const page = async (num, witchClass) => {

				let sortData = await getCourseraPageContent(num)
				sortData = sortData.results[1].hits

				let loopTimes = witchClass
				const maxTime = sortData.length

				if(maxTime){
					if(loopTimes % 5 === 0){
						let checkPoint = await getNowStatus("coursera")
						if(!+checkPoint){
							console.log("從外部被關閉")
							return
						}
					}

                    
					const getClassDetailLoop = async (sortData) => {
						if(loopTimes <  maxTime){
							const web = "https://www.coursera.org" + sortData[loopTimes].objectUrl

							const getClass = {
								id: sortData[loopTimes].objectID,
								name:sortData[loopTimes].name,
								department: sortData[loopTimes].productDifficultyLevel,
								professor: "",
								source: "coursera",
								remark: sortData[loopTimes]._snippetResult.description.value,
								url: web,
								description: "",
								rating: sortData[loopTimes].avgProductRating,
								imageUrl: sortData[loopTimes].imageUrl   
							}

							const data = await getClassDetail(getClass.url)

							getClass.professor = data.teacher[0]
							getClass.description = data.content

							if(getClass.rating){
								getClass.rating = getClass.rating.toFixed(1)    
							}

							const isNotRepeat = getAllClass.findIndex((value) => value.number == getClass.id)

							// 如果重複，新增新的課程

							if(isNotRepeat < 0){
								const package = [getClass.id, getClass.name, getClass.department, getClass.professor, getClass.source, getClass.remark, getClass.url, getClass.description, getClass.rating, getClass.imageUrl]
								// 將資料加入:D
								console.log("新增 " + getClass.name)
								const sql = "INSERT INTO class (number, class_name, department, professor, source, remarks, web_url, class_content, mark, image) VALUES (?)"
								await query(sql, [package])
							}else{
								console.log("課程重複")
							}

							// get coursera class detail
							setTimeout(() => {
								loopTimes++
								getClassDetailLoop(sortData)
							}, 500)

						}else{

							setTimeout(() => {
								console.log("下一頁")
								page(num+1, 0)
							}, 2000)
						}
                        
					}

					await getClassDetailLoop(sortData)


				}else{

					await query("UPDATE auto_work SET run = 0, msg = '課程更新完成' WHERE (work = 'coursera')")
					console.log("end")
					return
				}


			}

            
			// class detail
			const getClassDetail = async (url) => {
				let getClassDetail = await fetch(url)
				getClassDetail = await getClassDetail.text()
				const $ = cheerio.load(getClassDetail)
                
				const allTeacher = []

				// 抓取老師名稱
				$("div.instructor-wrapper div._wtdnuob").each( async (num, mark) => {

					const getTeacherData = $(mark).html()

					const _ = cheerio.load(getTeacherData)

					_("h3").each( (index, teacher) => {
						const teacherName = $(teacher).text()
						allTeacher.push(teacherName)
					})

				})


				// 抓取課程資訊
				let allcontent = "\n"
				$("div.content").each((num, content) => {
					const getText = $(content).text()

					if(getText.substr(0,8) !== "Subtitle"){
						if(num === 0){
							allcontent += getText + "\n"
						}else{
							allcontent += (" "+getText)
						}
					}
					// console.log($(content).text())
				})

				const resendClassData = {
					teacher: allTeacher,
					content: allcontent
				}

				return resendClassData

			}

			// 開始運作
			page(0, 0)


		}else{
			console.log("事件正在執行")
			return
		}


	}else{
		console.log("coursera功能 狀態為null")
		return
	}

}



module.exports = {
	getCoursera
}