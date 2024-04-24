const eslint = require('@rollup/plugin-eslint')

exports.default = {
  plugins: [
    eslint({
      fix: process.env.BUILD === 'fix'
    })
  ]
}
