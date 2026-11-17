const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight")
const pluginRss = require("@11ty/eleventy-plugin-rss")
const pillars = require("./src/data/pillars.js")

require('dotenv').config()

const archive = require('./lib/archive.js')

const isArchived = (item) => archive.isArchived(item.date, item.data.archive)

const groupByYear = (items) => {
  const groups = []

  items.forEach((item) => {
    const year = item.date.getUTCFullYear()
    const last = groups[groups.length - 1]

    if (last && last.year === year) {
      last.items.push(item)
    } else {
      groups.push({ year, items: [item] })
    }
  })

  return groups
}

module.exports = function (config) {
  config.addPlugin(syntaxHighlight)
  config.addPlugin(pluginRss)

  config.addFilter('dateToRfc3339', pluginRss.dateToRfc3339);

  config.addPassthroughCopy('src/assets')
  // Only copy post media, not the markdown sources or data files
  config.addPassthroughCopy('src/posts/**/*.{jpg,jpeg,png,webp,gif,svg,mp4,webm}')
  config.addPassthroughCopy('src/robots.txt')
  config.addPassthroughCopy('src/_redirects')
  config.addPassthroughCopy('src/_headers')

  config.addShortcode('year', () => `${new Date().getFullYear()}`)

  config.addNunjucksShortcode('numberFormat', (number) => {
    return new Intl.NumberFormat('en-GB').format(number)
  })

  config.addNunjucksFilter('compactNumber', (number) => {
    return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(number)
  })

  config.addNunjucksFilter('seconds_to_duration', (seconds) => {
    const minutes = Math.round(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    }

    return `${minutes}m`
  })

  config.addNunjucksFilter('meters_to_distance', (meters) => {
    const km = (meters / 1000).toFixed(2)

    return `${km}km`
  })

  // 30 April 2025
  config.addFilter('readableDate', (date) => {
    return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
  })

  // 30 Apr 2025
  config.addFilter('shortDate', (date) => {
    return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
  })

  // 30 Apr
  config.addFilter('dayMonth', (date) => {
    return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })
  })

  config.addFilter('isoDate', (date) => new Date(date).toISOString().slice(0, 10))

  config.addFilter('readingTime', (html) => {
    const words = String(html || '').replace(/<pre[\s\S]*?<\/pre>/g, ' ').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length

    return `${Math.max(1, Math.round(words / 230))} min read`
  })

  // Excerpts are written in markdown, so strip links and code ticks for listings and meta tags
  config.addFilter('plainExcerpt', (text, length = 220) => {
    const plain = String(text || '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/`/g, '')
      .replace(/\s+/g, ' ')
      .trim()

    if (plain.length <= length) {
      return plain
    }

    return plain.slice(0, plain.lastIndexOf(' ', length)).replace(/[,.;:]$/, '') + '…'
  })

  config.addFilter('pillar', (slug) => pillars.find((pillar) => pillar.slug === slug))

  config.addFilter('without', (items, url) => (items || []).filter((item) => item.url !== url))

  // Every post, newest first. Used by the feeds.
  config.addCollection('posts', function (collection) {
    return collection.getFilteredByGlob('src/posts/**/**/**/*.md').reverse()
  })

  // Current writing (2018 onwards unless overridden with `archive:` in front matter)
  config.addCollection('writing', function (collection) {
    return collection.getFilteredByGlob('src/posts/**/**/**/*.md').reverse().filter((item) => !isArchived(item))
  })

  config.addCollection('writingByYear', function (collection) {
    return groupByYear(collection.getFilteredByGlob('src/posts/**/**/**/*.md').reverse().filter((item) => !isArchived(item)))
  })

  config.addCollection('archiveByYear', function (collection) {
    return groupByYear(collection.getFilteredByGlob('src/posts/**/**/**/*.md').reverse().filter(isArchived))
  })

  pillars.forEach((pillar) => {
    config.addCollection(`pillar-${pillar.slug}`, function (collection) {
      return collection.getFilteredByGlob('src/posts/**/**/**/*.md').reverse()
        .filter((item) => !isArchived(item) && item.data.pillar === pillar.slug)
    })
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
