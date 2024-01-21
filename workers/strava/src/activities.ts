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

		body.activities = (await getStravaAthleteActivities(accessToken)).slice(0, 6)

		const promises = body.activities.map(async (activity: StravaActivity) => {
			if (activity.map && activity.map.summary_polyline) {
				const overlay = `path-3+9856E8(${encodeURIComponent(activity.map.summary_polyline)})`
				const url = new URL(`https://api.mapbox.com/styles/v1/${env.MAPBOX_USERNAME}/${env.MAPBOX_STYLE_ID}/static/${overlay}/auto/640x640@2x?access_token=${env.MAPBOX_ACCESS_TOKEN}`)

				activity.map.image = url.toString()
			}

			return activity
		})

		body.activities = await Promise.all(promises)

		return new Response(JSON.stringify(body), { status: 200 })
	},
}
