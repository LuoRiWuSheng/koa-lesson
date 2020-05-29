const validator = require('validator')
const { isEmpty } = require('../config/utils')

function validatorInputRegister (user) {
  let error = ''

  if (isEmpty(user.name)) {
    return '用户名不能为空'
  }

  if (!validator.isLength(user.name, { min: 2, max: 30 })) {
    return '用户名长度限定在2-30个字以内'
  }

  if (isEmpty(user.password)) {
    return '密码不能为空'
  }

  if (isEmpty(user.password2)) {
    return '密码不能为空'
  }

  if (!validator.isLength(user.password, {min: 6, max: 20})) {
    return '密码长度不能小于6位,不能大于20位'
  }

  if (!validator.equals(user.password, user.password2)) {
    return '两次密码不一致'
  }

  if(validator.isEmpty(user.email)) {
    return '邮箱不能为空'
  }
  if(!validator.isEmail(user.email)) {
    return '邮箱不合法'
  }

  return error
}

module.exports = validatorInputRegister