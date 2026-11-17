import { exchangeStravaCodeForToken } from './strava'
import { clearStateCookie, readStateCookie, statesMatch } from './state'

export default {
	handle: async (
		request: Request,
		env: Env,
	): Promise<Response> => {
		const url = new URL(request.url)

		// The state must match the one /authorize set for this browser, and it can only be used once
		const headers = { 'Set-Cookie': clearStateCookie(), 'Cache-Control': 'no-store' }

		if (!url.searchParams.has('code') || !statesMatch(url.searchParams.get('state'), readStateCookie(request))) {
			return new Response(null, { status: 400, headers })
		}

		const json = await exchangeStravaCodeForToken(
			env.STRAVA_CLIENT_ID,
			env.STRAVA_CLIENT_SECRET,
			url.searchParams.get('code') || '',
		)

		if (json.athlete.id !== 14657730) {
			return new Response(null, { status: 403, headers })
		}

		await env.iwader_co_uk.put('strava_access_token', json.access_token)
		await env.iwader_co_uk.put('strava_refresh_token', json.refresh_token)
		await env.iwader_co_uk.put('strava_expires_at', json.expires_at.toString())

		return new Response('Connected', { status: 200, headers })
	},
}
