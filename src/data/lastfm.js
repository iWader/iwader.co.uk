const EleventyFetch = require('@11ty/eleventy-fetch')

module.exports = async function () {
    console.log('Fetching lastfm data')

    const fetchConfig = {
        duration: '0d',
        type: 'json',
    }

    const promises = [
        EleventyFetch(`https://ws.audioscrobbler.com/2.0/?method=user.getweeklytrackchart&user=iwader&api_key=${process.env.LASTFM_TOKEN}&format=json`, fetchConfig),
        EleventyFetch(`https://ws.audioscrobbler.com/2.0/?method=user.getweeklyartistchart&user=iwader&api_key=${process.env.LASTFM_TOKEN}&format=json`, fetchConfig),
        EleventyFetch(`https://ws.audioscrobbler.com/2.0/?method=user.getweeklyalbumchart&user=iwader&api_key=${process.env.LASTFM_TOKEN}&format=json`, fetchConfig),
    ]

    const [topTracks, topArtists, topAlbums] = await Promise.all(promises)

    return {
        tracks: topTracks.weeklytrackchart.track.slice(0, 5),
        artists: topArtists.weeklyartistchart.artist.slice(0, 5),
        albums: topAlbums.weeklyalbumchart.album.slice(0, 5),
    }
}
