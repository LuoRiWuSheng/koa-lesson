function isEmpty (val) {
  // val如果是undefine 而undefined == null  是空
  return val == null || (typeof val === 'object' && Object.keys(val).length === 0)
    || (typeof val === 'string' && val.trim().length === 0)
}

module.exports = {
  isEmpty
}