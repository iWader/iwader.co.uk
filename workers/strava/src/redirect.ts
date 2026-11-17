import { getStravaRedirectUrl, StravaOAuthScope } from './strava'
import { createState, stateCookie } from './state'

export default {
	handle: async (
		request: Request,
		env: Env,
	): Promise<Response> => {
		const state = createState()

		const url = getStravaRedirectUrl(
			env.STRAVA_CLIENT_ID,
			'https://strava.iwader.workers.dev/receive',
			[StravaOAuthScope.READ, StravaOAuthScope.ACTIVITY_READ],
			state,
		)

		return new Response(null, {
			status: 302,
			headers: {
				'Location': url.toString(),
				'Set-Cookie': stateCookie(state),
				'Cache-Control': 'no-store',
			},
		})
	},
}
