export interface Env {
	iwader_co_uk: KVNamespace,
	AUTHORIZATION_TOKEN: string,
}

export interface Payload {
	hours_slept: number,
	floors_climbed: number,
	steps: number,
	cycle_distance: number,
	foot_distance: number,
}

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		if (request.headers.get('Authorization') !== `Bearer ${env.AUTHORIZATION_TOKEN}`) {
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

		return new Response()
	},
};
