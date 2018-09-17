# bem-validator-loader
[![npm version](https://img.shields.io/npm/v/bem-validator-loader.svg?style=flat-square)](https://www.npmjs.org/package/bem-validator-loader)

This is a validator to check that your css complains with [BEM](http://getbem.com/) naming convention


## Installing

Using npm:
```bash
$ npm install --save-dev bem-validator-loader
```

Using yarn
```bash
$ yarn add -D bem-validator-loader
```

## Example webpack.config.js
```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'bem-validator-loader']
      }
    ]
  }
}
```

## Options
* `include` (`exclude`)
List of regular expressions of filepaths to validate (skip)
```javascript
{
  loader: "bem-validator-loader",
  options: {
    exclude: "/node_modules"
  }
}
```

* `webpackDirectories`
Callback to calculate list of directories for bem module checking
```javascript
{
  loader: "bem-validator-loader",
  options: {
    include: [/webpack\/pages/, /webpack\/common/],
    webpackDirectories: fullpath => {
      const dirs = fullpath.split('/')
      const i = dirs.indexOf('webpack')
      return dirs.filter((dir, I) => I > i +1 )
    }
  }
}
```

* `onError`
Callback to catch errors. For example to replace all errors with warnings
```javascript
{
  loader: "bem-validator-loader",
  options: {
    onError: (error, options) => {
      if (options.filename.match(/pages/indes.sass/)) options.this.emitWarning(error)
      else throw new Error(error)
    }
  }
}
```


## BEM (Block Element Modifier) Validator webpack loader

**This is a fork of @torleif’s [BEM (Block Element Modifier) Validation Service](https://github.com/torleif/bem_validator)**

which is forked from

**This is a fork of @iamdustan’s [iamdustan’s AST explorer](https://github.com/iamdustan/reworkcss_ast_explorer)**

which is forked from

**This is a fork of @fkling’s [Esprima AST Explorer](https://github.com/fkling/esprima_ast_explorer)**

