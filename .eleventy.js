const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight")
const googleFonts = require("eleventy-google-fonts")
const pluginRss = require("@11ty/eleventy-plugin-rss")

require('dotenv').config()

module.exports = function (config) {
  config.addPlugin(syntaxHighlight)
  config.addPlugin(googleFonts)
  config.addPlugin(pluginRss)

  config.addFilter('dateToRfc3339', pluginRss.dateToRfc3339);

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
