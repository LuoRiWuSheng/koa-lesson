const Router = require('koa-router')
const router = new Router()
// 加密
const bcrypt = require('bcrypt');
// 全球默认头像
const gravatar = require('gravatar');
// 生成token
const jwt = require('jsonwebtoken');
// 密钥
const { secret } = require('../../config')
const User = require('../../modules/User')
const passport = require('koa-passport')
const _ = require('lodash')

const validatorInputLogin = require('../../validation/login')
const validatorInputRegister = require('../../validation/register')

const { isEmpty } = require('../../config/utils')

/**
 * @route GET api/users/login
 * @description 登录
 */
router.post('/login', async ctx => {
  let { name, email, password } = ctx.request.body

  let error = validatorInputLogin({ name, password })

  // 判断error是不是空对象
  if (!isEmpty(error)) {
    ctx.status = 400
    ctx.body = {
      msg: error,
      code: -1
    }
    return
  }

  const findRes = await User.find({ email })

  if (findRes.length === 0) {
    ctx.response.status = 500
    ctx.body = {
      msg: '用户不存在'
    }
    return
  }


  if (bcrypt.compareSync(password, findRes[0].password)) {
    // 生成token
    const payload = {
      id: findRes[0]._id,
      name: findRes[0].name,
      avatar: findRes[0].avatar
    }

    const token = jwt.sign(payload, secret, {
      // 过期时间
      expiresIn: Math.floor(Date.now() / 1000) + (60 * 60)
    })

    ctx.set('token', token)
    ctx.response.status = 200
    ctx.body = {
      msg: '登录成功',
      token: 'Bearer ' + token
    }
  } else {
    ctx.status = 400
    ctx.body = {
      msg: '密码错误'
    }
  }
})

router.get('/test', async ctx => {
  ctx.body = {
    msg: 'user/api'
  }
})

/**
 * @route POST api/users/register
 * @description 注册接口
 */
router.post('/register', async ctx => {
  let { name, password, email } = ctx.request.body

  var validateRes = validatorInputRegister(ctx.request.body)
  if (!_.isEmpty(validateRes)) {
    ctx.status = 400
    ctx.body = {
      msg: validateRes,
      code: -1
    }
    return
  }

  const res = await User.find({ email })

  if (res.length > 0) {
    ctx.response.status = 500
    ctx.body = {
      email: '邮箱已被占用'
    }
  } else {
    console.log('进来---');
    //生成salt的迭代次数
    const saltRounds = 10;
    //随机生成salt
    const salt = bcrypt.genSaltSync(saltRounds);
    //获取hash值
    var hash = bcrypt.hashSync(password, salt);

    password = hash

    // 获取头像
    // s标识头像大小
    // r 头像的等级，有点可能包好一些不好的内容
    const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' })
    const newUser = new User({
      name,
      password: hash,
      email,
      avatar
    })

    const saveRes = await newUser.save()
    ctx.body = saveRes
  }
})

/**
 * @route GET /api/users/current
 * @description 用户信息接口，返回用户信息
 * @access 私有接口
 */
router.get('/current', passport.authenticate('jwt', { session: false }), async ctx => {
  const user = ctx.state.user

  console.log('user', user);

  // 去掉 password
  const { name, email, avatar } = user

  ctx.body = {
    success: true,
    data: {
      name, email, avatar
    }
  }
})

module.exports = router.routes()