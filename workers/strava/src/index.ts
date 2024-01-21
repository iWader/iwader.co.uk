import activities from './activities'
import receive from './receive'
import redirect from './redirect'

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext,
	): Promise<Response> {
		const url = new URL(request.url);

		switch (url.pathname) {
			case '/authorize':
				return redirect.handle(request, env)

			case '/receive':
				return receive.handle(request, env)

			case '/activities':
				return activities.handle(request, env)
		}

		return new Response('Not Found', { status: 404 })
	},
};
