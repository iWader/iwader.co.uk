const { isArchived } = require('../../lib/archive.js')

module.exports = {
  layout: 'post',
  eleventyComputed: {
    archived: (data) => isArchived(data.page.date, data.archive),
  },
}
