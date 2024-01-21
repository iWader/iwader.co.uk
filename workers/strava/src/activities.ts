import { getStravaAccessToken, getStravaAthleteActivities } from './strava'

interface ResponseBody {
	activities: StravaActivity[]
}

export default {
	handle: async (
		request: Request,
		env: Env,
	): Promise<Response> => {
		let accessToken: string | null = null
		const body: ResponseBody = {
			activities: [],
		}

		try {
			accessToken = await getStravaAccessToken(env)
		} catch (e) {
			console.error(e)
		}

		if (!accessToken) {
			console.error('Unable to retrieve access token')

			return new Response(JSON.stringify(body), { status: 200 })
		}

		body.activities = await getStravaAthleteActivities(accessToken)

		return new Response(JSON.stringify(body), { status: 200 })
	},
}
