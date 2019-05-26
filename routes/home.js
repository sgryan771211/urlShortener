const express = require('express')
const router = express.Router()
const Url = require('../models/url')

//首頁
router.get('/', (req, res) => {
  res.rend('首頁')
})

// 新增一筆 url
router.post('/', (req, res) => {
  res.rend('新增一筆 url')
})

//連向原始網站
router.get('/:shortUrl', (req, res) => {
  res.rend('連向原始網站')
})

module.exports = router