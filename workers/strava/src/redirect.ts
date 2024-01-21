import { getStravaRedirectUrl, StravaOAuthScope } from './strava'

export default {
	handle: async (
		request: Request,
		env: Env,
	): Promise<Response> => {
		const url = getStravaRedirectUrl(
			env.STRAVA_CLIENT_ID,
			'https://strava.iwader.workers.dev/receive',
			[StravaOAuthScope.READ, StravaOAuthScope.ACTIVITY_READ],
			env.OAUTH_STATE,
		)

		return Response.redirect(url.toString())
	},
}
