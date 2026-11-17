// A random OAuth state per authorisation attempt, held in a short-lived cookie scoped to this worker.
// SameSite=Lax means the browser sends it on Strava's top-level redirect back to /receive.
export const STATE_COOKIE = '__Host-strava_oauth_state'

const encoder = new TextEncoder()

export const createState = (): string => {
	const bytes = crypto.getRandomValues(new Uint8Array(32))

	return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export const stateCookie = (state: string): string => {
	return `${STATE_COOKIE}=${state}; Path=/; Max-Age=600; HttpOnly; Secure; SameSite=Lax`
}

export const clearStateCookie = (): string => {
	return `${STATE_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`
}

export const readStateCookie = (request: Request): string | null => {
	const cookies = request.headers.get('Cookie') || ''

	for (const part of cookies.split(';')) {
		const [name, ...value] = part.trim().split('=')

		if (name === STATE_COOKIE) {
			return value.join('=') || null
		}
	}

	return null
}

export const statesMatch = (given: string | null, expected: string | null): boolean => {
	if (!given || !expected) {
		return false
	}

	const a = encoder.encode(given)
	const b = encoder.encode(expected)

	return a.byteLength === b.byteLength && crypto.subtle.timingSafeEqual(a, b)
}
