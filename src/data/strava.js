const EleventyFetch = require('@11ty/eleventy-fetch')

module.exports = async function () {
    console.log('Fetching strava data')

    const data = await EleventyFetch('https://strava.iwader.workers.dev/activities', {
        duration: '1d',
        type: 'json',
    })

    return {
        activities: data.activities.slice(0, 8),
    }
}
