const fetch = require('node-fetch')
const cheerio = require('cheerio')

const main = async () =>{
    let num = 0
    let body = `{\"requests\":[{\"indexName\":\"DO_NOT_DELETE_PLACEHOLDER_INDEX_NAME\",\"params\":\"query=free&page=0&highlightPreTag=%3Cais-highlight-0000000000%3E&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&clickAnalytics=true&facets=%5B%5D&tagFilters=\"},{\"indexName\":\"prod_degrees\",\"params\":\"query=free&page=0&highlightPreTag=%3Cais-highlight-0000000000%3E&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&clickAnalytics=true&facets=%5B%5D&tagFilters=\"},{\"indexName\":\"prod_all_products_term_optimization\",\"params\":\"query=free&hitsPerPage=10&maxValuesPerFacet=500&page=${num}&highlightPreTag=%3Cais-highlight-0000000000%3E&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&clickAnalytics=true&ruleContexts=%5B%22zh%22%5D&facets=%5B%22allLanguages%22%2C%22productDifficultyLevel%22%2C%22productDurationEnum%22%2C%22topic%22%2C%22skills%22%2C%22partners%22%2C%22entityTypeDescription%22%5D&tagFilters=\"},{\"indexName\":\"test_suggestions\",\"params\":\"query=free&page=0&highlightPreTag=%3Cais-highlight-0000000000%3E&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&clickAnalytics=true&facets=%5B%5D&tagFilters=\"}]}`

    // console.log(JSON.parse(body))

    let test = await fetch("https://lua9b20g37-3.algolianet.com/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%20(lite)%203.30.0%3Breact-instantsearch%205.2.3%3BJS%20Helper%202.26.1&x-algolia-application-id=LUA9B20G37&x-algolia-api-key=dcc55281ffd7ba6f24c3a9b18288499b", {
    "headers": {
        "accept": "application/json",
        "accept-language": "zh-TW,zh;q=0.9",
        "content-type": "application/x-www-form-urlencoded",
        "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site"
    },
    "referrer": "https://www.coursera.org/",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": body,
    "method": "POST",
    "mode": "cors"
    });

    let sortData = await test.json()
    sortData = sortData.results[2].hits

    console.log(sortData[0])

    for(let i = 0; i< sortData.length; i++){
        const package = []
        package.push(sortData[i].name)
        package.push(sortData[i].avgProductRating) // 評分
        package.push(sortData[i].imageUrl) // image
        package.push(sortData[i]._snippetResult.description.value) // 介紹
        package.push(sortData[i].objectUrl) // objectUrl
        package.push(sortData[i].objectID) // objectID
               
        console.log(package)
    }

}

main()