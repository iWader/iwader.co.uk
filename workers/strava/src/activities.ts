import { getStravaAccessToken, getStravaAthleteActivities } from './strava'

// Route colours match iwader.co.uk: the accent purple with a halo in the map's land colour
const ROUTE_LIGHT = { line: '7C3AED', halo: 'FFFFFF' }
const ROUTE_DARK = { line: 'A78BFA', halo: '1A1720' }

// The Static Images API rejects URLs over 8,192 characters
const MAX_URL_LENGTH = 8192

const mapImageUrl = (env: Env, styleId: string, polyline: string, route: { line: string, halo: string }): string => {
	const encoded = encodeURIComponent(polyline)
	const build = (overlay: string) => `https://api.mapbox.com/styles/v1/${env.MAPBOX_USERNAME}/${styleId}/static/${overlay}/auto/640x400@2x?padding=40&access_token=${env.MAPBOX_ACCESS_TOKEN}`

	const withHalo = build(`path-8+${route.halo}-0.85(${encoded}),path-4+${route.line}(${encoded})`)

	if (withHalo.length <= MAX_URL_LENGTH) {
		return withHalo
	}

	// Long routes: drop the halo so the polyline only appears once
	return build(`path-4+${route.line}(${encoded})`)
}

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

		body.activities = (await getStravaAthleteActivities(accessToken))

		const promises = body.activities.map(async (activity: StravaActivity) => {
			if (activity.map && activity.map.summary_polyline) {
				activity.map.image = mapImageUrl(env, env.MAPBOX_STYLE_ID, activity.map.summary_polyline, ROUTE_LIGHT)

				if (env.MAPBOX_STYLE_ID_DARK) {
					activity.map.image_dark = mapImageUrl(env, env.MAPBOX_STYLE_ID_DARK, activity.map.summary_polyline, ROUTE_DARK)
				}
			}

			return activity
		})

		body.activities = await Promise.all(promises)

		return new Response(JSON.stringify(body), { status: 200 })
	},
}
