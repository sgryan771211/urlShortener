const express = require('express')
const router = express.Router()
const Url = require('../models/url')

//首頁
router.get('/', (req, res) => {
  res.render('index')
})

// 新增一筆 url
router.post('/', (req, res) => {
  //若使用者沒有輸入內容，防止表單送出並提示使用者
  if (!req.body.originUrl) {
    res.render('index', { warning_msg: '網址是必填的，請輸入網址' })
  } else {
    //產生短網址
    function sample(array) {
      const index = Math.floor(Math.random() * array.length)
      return array[index]
    }

    function createShortUrl() {
      const lowerCaseLetters = 'abcdefghiklmnopqrstuvwxyz'
      const upperCaseLetters = lowerCaseLetters.toUpperCase()
      const numbers = '1234567890'
      let collection = []
      collection = collection.concat(lowerCaseLetters.split(''))
      collection = collection.concat(upperCaseLetters.split(''))
      collection = collection.concat(numbers.split(''))

      let shortUrl = ''
      for (let i = 0; i < 5; i++) {
        shortUrl += sample(collection)
      }
      return shortUrl
    }

    let shortUrl = createShortUrl()

    //防止有重覆的網址組合出現
    Url.findOne({ shortUrl: shortUrl }, (err, url) => {
      if (url) {
        res.render('index', { warning_msg: '因產生重複短網址，請重新輸入' })
      } else {
        //儲存網址
        const newUrl = Url({
          originUrl: req.body.originUrl.slice(8),
          shortUrl: shortUrl
        })

        newUrl.save(err => {
          if (err) return console.error(err)
          return res.render('result', { shortUrl: shortUrl })
        })
      }
    })
  }
})


//連向原始網站
router.get('/:shortUrl', (req, res) => {
  Url.findOne({ shortUrl: req.params.shortUrl }, (err, url) => {
    if (err) console.log(err)
    if (url) {
      return res.redirect(`http://${url.originUrl}`)
    }
  })
})

module.exports = router