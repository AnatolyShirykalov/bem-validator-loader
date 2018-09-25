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
  return errors.map((error => {
    const {start, end} = error.position
    return (
      `  BEM validation error in ${fn}:L${start.line}:C${start.column}--L${end.line}:C${end.column}\n`+
      `    selector: ${(error.selectors || []).join(',')}\n`+
      `    violation: ${error.violation}\n`+
      `    error: ${error.error}\n`+
      `    example: ${error.example}\n`
    )
  })).join("\n")
}

const defaultWebpackDirectories = fullpath => {
  const dirs = fullpath.split('/')
  const i = dirs.indexOf('webpack')
  return dirs.filter((dir, I) => I > i +1 )
}

module.exports = function(source, map, meta) {
  const options = getOptions(this);

  if(needToCheck(options, this.resourcePath)) {

    const errors = bem.parse(source, {
      filename: this.resourcePath,
      webpackDirectories: options.webpackDirectories || defaultWebpackDirectories
    }).Errors

    if (!errors || errors.length === 0) {
      this.callback(null, source, map, meta)
      return null;
    }
    const error = mkError(this.resourcePath, errors)
    if (options.onError) options.onError(error, {this: this, filename: this.resourcePath})
    else throw new Error(error)
  }

  this.callback(null, source, map, meta)
  return null;
}
