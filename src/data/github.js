const EleventyFetch = require('@11ty/eleventy-fetch')

module.exports = async function () {
  console.log('Fetching github data')

  const fetchConfig = {
    duration: '1d',
    type: 'json',
    fetchOptions: {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    },
  }

  let hasMore = true
  let contributions = 0
  let page = 1
  const perPage = 100
  const url = `https://api.github.com/user/repos?type=all&per_page=${perPage}`

  while (hasMore) {
    const repositories = await EleventyFetch(`${url}&page=${page}`, fetchConfig)

    const promises = repositories.map(async (repository) => {
      const [vendor, name] = repository.full_name.split('/')
      let contributors

      try {
        // This request will fail if the repository is empty
        contributors = await EleventyFetch(`https://api.github.com/repos/${encodeURIComponent(vendor)}/${encodeURIComponent(name)}/contributors`, fetchConfig)
      } catch (e) {
        contributors = []
      }

      contributors.forEach((contributor) => {
        if (contributor.login === 'iWader') {
          contributions = contributions + contributor.contributions
        }
      })
    })

    await Promise.all(promises)

    hasMore = repositories.length >= perPage
    page = page + 1
  }

  return {
    contributions,
  }
}
