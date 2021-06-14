const { 
    getRecommend,
    translateText,
    upDataRecommend
} = require('../models/recommend_model')

const { getClass } = require('../crawlers/ntu_crawlers/ntu_class')

const { translteModel } = require('../models/translate_model')

const { getCoursera } = require('../crawlers/coursera_crawlers/coursera_class')

const { query } = require('../models/mysql_model')

const translte = async (req, res) => {
    translteModel()
    res.send('yes')

}

const ntu = (req, res) => {
    getClass()
    res.send('yes')
}


const coursera = (req, res) => {
    getCoursera()
    res.send('yes')
}


const recommend = async (req, res) => {
    upDataRecommend()
    res.send('yes')
}

module.exports = {
    recommend,
    translte,
    ntu,
    coursera
}