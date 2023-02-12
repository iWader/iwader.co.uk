const EleventyFetch = require('@11ty/eleventy-fetch')

module.exports = async function () {
  console.log('Fetching whatpulse data')

  const response = await EleventyFetch('https://api.whatpulse.org/user.php?user=321842&format=json', {
    duration: '1d',
    type: 'json',
  })

  return {
    keys: parseInt(response.Keys, 10),
    clicks: parseInt(response.Clicks, 10),
  }
}
