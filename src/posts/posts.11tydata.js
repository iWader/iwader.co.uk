const fs = require('node:fs')
const path = require('node:path')
const { isArchived } = require('../../lib/archive.js')

// The first photo in a post's markdown, either ![alt](src) or <img src="">. Animations and SVGs are skipped.
const firstImage = (inputPath) => {
  const markdown = fs.readFileSync(inputPath, 'utf8')
  const pattern = /!\[[^\]]*\]\(([^)\s]+)[^)]*\)|<img[^>]+src="([^"]+)"/g

  for (const match of markdown.matchAll(pattern)) {
    const src = match[1] || match[2]

    if (/\.(jpe?g|png)$/i.test(src) && !/^https?:/i.test(src)) {
      return path.join(path.dirname(inputPath), src)
    }
  }

  return null
}

module.exports = {
  layout: 'post',
  eleventyComputed: {
    archived: (data) => isArchived(data.page.date, data.archive),

    // Social preview image. Set `image: some-photo.jpeg` in front matter to choose one, otherwise the first photo is used.
    socialImage: async (data) => {
      const src = data.image ? path.join(path.dirname(data.page.inputPath), data.image) : firstImage(data.page.inputPath)

      if (!src) {
        return null
      }

      const { default: Image } = await import('@11ty/eleventy-img')
      const stats = await Image(src, {
        widths: [1200],
        formats: ['jpeg'],
        urlPath: '/img/',
        outputDir: 'public/img/',
      })
      const { url, width, height } = stats.jpeg[0]

      return { url, width, height }
    },
  },
}
