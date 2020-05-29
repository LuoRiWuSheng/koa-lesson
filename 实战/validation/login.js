const validator = require('validator')
const { isEmpty } = require('../config/utils')

function validatorInputLogin (user) {
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

  return error
}

module.exports = validatorInputLogin