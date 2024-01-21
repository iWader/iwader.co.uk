interface StravaOAuthTokenResponse {
	access_token: string
	refresh_token: string
	expires_at: number
	expires_in: number
	athlete: StravaAthlete
}

interface StravaOAuthRefreshResponse {
	access_token: string
	refresh_token: string
	expires_at: number
	expires_in: number
}

interface StravaAthlete {
	id: number
}

interface StravaActivity {
	name: string
	elapsed_time: number
	distance: number
	type: 'Ride' | 'Run' | 'Walk' | 'WeightTraining'
}
