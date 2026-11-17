// Posts dated before this year are shown as archive unless a post sets `archive: true|false` in front matter
const ARCHIVE_BEFORE_YEAR = 2018

const isArchived = (date, archive) => {
  if (typeof archive === 'boolean') {
    return archive
  }

  return new Date(date).getUTCFullYear() < ARCHIVE_BEFORE_YEAR
}

module.exports = { ARCHIVE_BEFORE_YEAR, isArchived }
