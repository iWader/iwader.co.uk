const encoder = new TextEncoder()

// Compare SHA-256 digests so both inputs are the same length and the comparison takes the same time
// whatever the token, rather than returning early at the first mismatched character
const isAuthorized = async (header: string | null, token: string): Promise<boolean> => {
	if (!header || !token) {
		return false
	}

	const [given, expected] = await Promise.all([
		crypto.subtle.digest('SHA-256', encoder.encode(header)),
		crypto.subtle.digest('SHA-256', encoder.encode(`Bearer ${token}`)),
	])

	return crypto.subtle.timingSafeEqual(given, expected)
}

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext,
	): Promise<Response> {
		if (!(await isAuthorized(request.headers.get('Authorization'), env.AUTHORIZATION_TOKEN))) {
			return new Response(null, {
				status: 401,
			})
		}

		const json: Payload = await request.json()

		await env.iwader_co_uk.put('hours_slept', json.hours_slept.toString())
		await env.iwader_co_uk.put('floors_climbed', json.floors_climbed.toString())
		await env.iwader_co_uk.put('steps', json.steps.toString())
		await env.iwader_co_uk.put('cycle_distance', json.cycle_distance.toString())
		await env.iwader_co_uk.put('foot_distance', json.foot_distance.toString())
		await env.iwader_co_uk.put('weight', json.weight.toString())

		return new Response()
	},
}
