import { exchangeStravaCodeForToken } from './strava'

export default {
	handle: async (
		request: Request,
		env: Env,
	): Promise<Response> => {
		const url = new URL(request.url)

		if (!url.searchParams.has('code') || !url.searchParams.has('state') || url.searchParams.get('state') !== env.OAUTH_STATE) {
			return new Response(null, { status: 400 })
		}

		const json = await exchangeStravaCodeForToken(
			env.STRAVA_CLIENT_ID,
			env.STRAVA_CLIENT_SECRET,
			url.searchParams.get('code') || '',
		)

		if (json.athlete.id !== 14657730) {
			return new Response(null, { status: 403 })
		}

		await env.iwader_co_uk.put('strava_access_token', json.access_token)
		await env.iwader_co_uk.put('strava_refresh_token', json.refresh_token)
		await env.iwader_co_uk.put('strava_expires_at', json.expires_at.toString())

		return new Response('Connected', { status: 200 })
	},
}
