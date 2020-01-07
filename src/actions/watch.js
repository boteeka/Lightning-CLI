const build = require('./build')
const watch = require('watch')

const regexp = /^(?!src|static|settings\.json|metadata\.json)(.+)$/

module.exports = (initCallback, watchCallback) => {
  return watch.watchTree(
    './',
    {
      interval: 1,
      filter(f) {
        return !!!regexp.test(f)
      },
      ignoreDirectoryPattern: /node_modules|\.git|dist/,
    },
    (f, curr, prev) => {
      if (typeof f == 'object' && prev === null && curr === null) {
        build(true).then(initCallback && initCallback)
      } else {
        // pass the 'type of change' based on the file that was changes
        let change
        if (/^src\//g.test(f)) {
          change = 'src'
        }
        if (/^static\//g.test(f)) {
          change = 'static'
        }
        if (f === 'metadata.json') {
          change = 'metadata'
        }
        if (f === 'settings.json') {
          change = 'settings'
        }

        build(false, change).then(watchCallback && watchCallback) // fixme: pass an object with what to build exactly ...
      }
    }
  )
}
