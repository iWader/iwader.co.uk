// Posts dated before this year are shown as archive unless a post sets `archive: true|false` in front matter
const ARCHIVE_BEFORE_YEAR = 2018

module.exports = {
  layout: 'post',
  eleventyComputed: {
    archived: (data) => {
      if (typeof data.archive === 'boolean') {
        return data.archive
      }

      return new Date(data.page.date).getUTCFullYear() < ARCHIVE_BEFORE_YEAR
    },
  },
}
