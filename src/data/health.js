const EleventyFetch = require('@11ty/eleventy-fetch')

module.exports = async function () {
  console.log('Fetching health data')

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const namespaceId = process.env.CLOUDFLARE_KV_NAMESPACE_ID

  const baseUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces/${namespaceId}/values`

  const fetchConfig = {
    duration: '1d',
    type: 'text',
    fetchOptions: {
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
      },
    },
  }

  const promises = [
    EleventyFetch(`${baseUrl}/steps`, fetchConfig),
    EleventyFetch(`${baseUrl}/foot_distance`, fetchConfig),
    EleventyFetch(`${baseUrl}/cycle_distance`, fetchConfig),
    EleventyFetch(`${baseUrl}/floors_climbed`, fetchConfig),
    EleventyFetch(`${baseUrl}/hours_slept`, fetchConfig),
  ]

  const [
    steps,
    footDistance,
    cycleDistance,
    floorsClimbed,
    hoursSlept
  ] = await Promise.all(promises)

  return {
    steps: parseInt(steps, 10),
    footDistance: parseInt(footDistance, 10),
    cycleDistance: parseInt(cycleDistance, 10),
    floorsClimbed: parseInt(floorsClimbed, 10),
    hoursSlept: parseInt(hoursSlept, 10),
  }
}
