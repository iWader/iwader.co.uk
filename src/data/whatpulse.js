const EleventyFetch = require('@11ty/eleventy-fetch')

module.exports = async function () {
  console.log('Fetching whatpulse data')

  const fetchConfig = {
    duration: '0',
    type: 'json',
    fetchOptions: {
      headers: {
        Authorization: `Bearer ${process.env.WHATPULSE_TOKEN}`,
      },
    },
  }

  const response = await EleventyFetch('https://whatpulse.org/api/v1/users/321842', fetchConfig)

  return {
    keys: parseInt(response.user.totals.keys, 10),
    clicks: parseInt(response.user.totals.clicks, 10),
  }
}
