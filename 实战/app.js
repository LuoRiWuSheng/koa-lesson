const Koa = require('koa')
const mongoose = require('mongoose')
const db = mongoose.connection

// 实例化koa
const app = new Koa()
const Router = require('koa-router')
const router = new Router()
// 解析body
const bodyParser = require('koa-bodyparser')
// 请求日志
const logger = require('koa-logger')
// 验证
const passport = require('koa-passport')

const userRouter = require('./router/api/users')

app.use(bodyParser())
app.use(logger())

require('./config/passport')(passport)

const { mongoURI } = require('./config')

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, authSource: 'admin' })
  .then(() => {
    console.log('数据库连接成功');
  })
  .catch(err => {
    console.log(err);
  });

  // 初始化
app.use(passport.initialize())
app.use(passport.session())

// 配置路由地址
router.use('/api/users', userRouter)
router.use(router.routes())
app.use(router.routes()).use(router.allowedMethods())

app.listen(3000, () => {
  console.log('监听3000 port');
})