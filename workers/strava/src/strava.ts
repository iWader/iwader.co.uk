export enum StravaOAuthScope {
	READ = 'read',
	ACTIVITY_READ = 'activity:read',
}

export const getStravaRedirectUrl = (clientId: string, redirectUri: string, scope: StravaOAuthScope[], state: string): URL => {
	const url = new URL('https://www.strava.com/oauth/authorize')

	url.searchParams.set('client_id', clientId)
	url.searchParams.set('redirect_uri', redirectUri)
	url.searchParams.set('response_type', 'code')
	url.searchParams.set('scope', scope.join(','))
	url.searchParams.set('state', state)

	return url
}

export const exchangeStravaCodeForToken = async (clientId: string, clientSecret: string, code: string): Promise<StravaOAuthTokenResponse> => {
	const url = new URL('https://www.strava.com/api/v3/oauth/token')

	url.searchParams.set('client_id', clientId)
	url.searchParams.set('client_secret', clientSecret)
	url.searchParams.set('code', code)
	url.searchParams.set('grant_type', 'authorization_code')

	const response = await fetch(url, {
		method: 'POST',
	})

	return await response.json() as StravaOAuthTokenResponse
}

export const refreshStravaAccessToken = async (clientId: string, clientSecret: string, refreshToken: string): Promise<StravaOAuthRefreshResponse | null> => {
	const url = new URL('https://www.strava.com/api/v3/oauth/token')

	url.searchParams.set('client_id', clientId)
	url.searchParams.set('client_secret', clientSecret)
	url.searchParams.set('refresh_token', refreshToken)
	url.searchParams.set('grant_type', 'refresh_token')

	const response = await fetch(url, {
		method: 'POST',
	})

	return await response.json() as StravaOAuthRefreshResponse
}

export const getStravaAccessToken = async (env: Env): Promise<string | null> => {
	const token = await env.iwader_co_uk.get('strava_access_token')
	const refresh = await env.iwader_co_uk.get('strava_refresh_token')
	const expiry = await env.iwader_co_uk.get('strava_expires_at')

	if (!token || !refresh || !expiry) {
		throw new Error('Strava is not connected')
	}

	// Attempt refresh
	if (parseInt(expiry, 10) < (Date.now() / 1000)) {
		const response = await refreshStravaAccessToken(env.STRAVA_CLIENT_ID, env.STRAVA_CLIENT_SECRET, refresh)

		if (!response) {
			throw new Error('Failed to refresh access token')
		}

		await env.iwader_co_uk.put ('strava_access_token', response.access_token)
		await env.iwader_co_uk.put('strava_refresh_token', response.refresh_token)
		await env.iwader_co_uk.put('strava_expires_at', response.expires_at.toString())

		return response.access_token
	}

	return token
}

export const getStravaAthleteActivities = async (accessToken: string): Promise<StravaActivity[]> => {
	const response = await fetch(
		'https://www.strava.com/api/v3/athlete/activities',
		{
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${accessToken}`,
			},
		}
	)

	return await response.json() as StravaActivity[]
}
