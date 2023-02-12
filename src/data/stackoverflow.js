const EleventyFetch = require('@11ty/eleventy-fetch')

module.exports = async function () {
  console.log('Fetching stackoverflow data')

  const fetchConfig = {
    duration: '1d',
    type: 'json',
  }

  const promises = [
    EleventyFetch('https://api.stackexchange.com/2.3/users/1126663?site=stackoverflow', fetchConfig),
    EleventyFetch('https://api.stackexchange.com/2.3/users/1126663/comments?site=stackoverflow&filter=total', fetchConfig),
    EleventyFetch('https://api.stackexchange.com/2.3/users/1126663/answers?site=stackoverflow&filter=total', fetchConfig),
  ]

  const [user, comments, answers] = await Promise.all(promises)

  return {
    badges: {
      gold: user.items[0].badge_counts.gold,
      silver: user.items[0].badge_counts.silver,
      bronze: user.items[0].badge_counts.bronze,
    },
    reputation: user.items[0].reputation,
    comments: comments.total,
    answers: answers.total,
  }
}
