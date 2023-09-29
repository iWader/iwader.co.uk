const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight")
const googleFonts = require("eleventy-google-fonts")

require('dotenv').config()

module.exports = function (config) {
  config.addPlugin(syntaxHighlight)
  config.addPlugin(googleFonts)

  config.addPassthroughCopy('src/assets')
  config.addPassthroughCopy('src/posts')
  config.addPassthroughCopy('src/robots.txt')
  config.addPassthroughCopy('src/ai.txt')

  config.addShortcode('year', () => `${new Date().getFullYear()}`)

  config.addNunjucksShortcode('numberFormat', (number) => {
    return new Intl.NumberFormat().format(number)
  })

  config.addCollection('posts', function(collection) {
    return collection.getFilteredByGlob('src/posts/**/**/**/*.md').reverse()
  })

  return {
    dir: {
      input: 'src',
      output: 'public',
      layouts: 'layouts',
      data: 'data',
    }
  }
}
