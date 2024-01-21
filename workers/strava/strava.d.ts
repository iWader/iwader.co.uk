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

enum SportType {
	AlpineSki = 'AlpineSki',
	BackcountrySki = 'BackcountrySki',
	Badminton = 'Badminton',
	Canoeing = 'Canoeing',
	Crossfit = 'Crossfit',
	EBikeRide = 'EBikeRide',
	Elliptical = 'Elliptical',
	EMountainBikeRide = 'EMountainBikeRide',
	Golf = 'Golf',
	GravelRide = 'GravelRide',
	Handcycle = 'Handcycle',
	HighIntensityIntervalTraining = 'HighIntensityIntervalTraining',
	Hike = 'Hike',
	IceSkate = 'IceSkate',
	InlineSkate = 'InlineSkate',
	Kayaking = 'Kayaking',
	Kitesurf = 'Kitesurf',
	MountainBikeRide = 'MountainBikeRide',
	NordicSki = 'NordicSki',
	Pickleball = 'Pickleball',
	Pilates = 'Pilates',
	Racquetball = 'Racquetball',
	Ride = 'Ride',
	RockClimbing = 'RockClimbing',
	RollerSki = 'RollerSki',
	Rowing = 'Rowing',
	Run = 'Run',
	Sail = 'Sail',
	Skateboard = 'Skateboard',
	Snowboard = 'Snowboard',
	Snowshoe = 'Snowshoe',
	Soccer = 'Soccer',
	Squash = 'Squash',
	StairStepper = 'StairStepper',
	StandUpPaddling = 'StandUpPaddling',
	Surfing = 'Surfing',
	Swim = 'Swim',
	TableTennis = 'TableTennis',
	Tennis = 'Tennis',
	TrailRun = 'TrailRun',
	Velomobile = 'Velomobile',
	VirtualRide = 'VirtualRide',
	VirtualRow = 'VirtualRow',
	VirtualRun = 'VirtualRun',
	Walk = 'Walk',
	WeightTraining = 'WeightTraining',
	Wheelchair = 'Wheelchair',
	Windsurf = 'Windsurf',
	Workout = 'Workout',
	Yoga = 'Yoga',
}

interface PolylineMap {
	id: string
	polyline: string
	summary_polyline: string
	image: string | never
}

interface StravaActivity {
	name: string
	elapsed_time: number
	distance: number
	sport_type: SportType
	map: PolylineMap | null
}
