const EleventyFetch = require('@11ty/eleventy-fetch')

const fetchActivities = async (token) => {
    return EleventyFetch('https://www.strava.com/api/v3/athlete/activities', {
        duration: '0s', // TODO: Should be 1d
        type: 'json',
        fetchOptions: {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    })
}

const refreshToken = async () => {
    return EleventyFetch('https://www.strava.com/oauth/token', {
        duration: '0s',
        type: 'json',
        fetchOptions: {
            method: 'POST',
            body: `client_id=${process.env.STRAVA_CLIENT_ID}&client_secret=${process.env.STRAVA_CLIENT_SECRET}&refresh_token=${process.env.STRAVA_REFRESH_TOKEN}&grant_type=refresh_token`
        },
    })
}

module.exports = async function () {
    console.log(`Fetching strava data. https://www.strava.com/oauth/authorize?client_id=${process.env.STRAVA_CLIENT_ID}&redirect_uri=http://localhost&response_type=code&scope=activity:read`)

    const token = await refreshToken()
    const response = await fetchActivities(token)

    if (!response.ok) {
        throw new Error('Strava data fetch failed')
    }

    const data = await response.json()

    console.log({ data })

    return {
        activities: [],
    }
}
