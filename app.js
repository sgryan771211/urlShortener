const express = require('express')
const app = express()
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))
app.use(flash())
app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/shortener', { useNewUrlParser: true })

const db = mongoose.connection

// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})

// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

//路由
app.use('/', require('./routes/home'))

app.listen(process.env.PORT || 3000, () => {
  console.log('App is running')
})