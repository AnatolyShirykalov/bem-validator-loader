const { getOptions } = require('loader-utils');
const bem = require('./bem')

const toArray = (option=[]) => {
  if (!Array.isArray(option)) return [option]
  return option
}

const needToCheck = (options, path) => {
  const incs = toArray(options.include)
  const excs = toArray(options.exclude)
  return (
    (incs.length == 0 || !incs.map(ptrn => !path.match(ptrn)).reduce((s, a) => s && a)) &&
    (excs.length == 0 || !excs.map(ptrn =>  path.match(ptrn)).reduce((s, a) => s || a))
  )
}

const mkError = (fn, errors) => {
  return `${fn}\n${JSON.stringify(errors, null, 2)}\n\n`
}

module.exports = function(source) {
  const options = getOptions(this);
  if(needToCheck(options, this.resourcePath)) {
    const errors = bem.parse(source).Errors
    if (!errors || errors.length === 0) return source;
    throw new Error(mkError(this.resourcePath, errors))
  }
  return source
}
