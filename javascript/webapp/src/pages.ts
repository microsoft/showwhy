/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export interface PageDetails {
	title: string
	icon: string
	route: string
}

export const pages: {
	model: PageDetails
	wrangle: PageDetails
	explore: PageDetails
	exposure: PageDetails
	events: PageDetails
} = {
	model: {
		title: 'Model Domain',
		icon: 'TableComputed',
		route: 'model',
	},
	wrangle: {
		title: 'Wrangle Data',
		icon: 'TableComputed',
		route: 'wrangle',
	},
	explore: {
		title: 'Explore',
		icon: 'SearchAndApps',
		route: 'explore',
	},
	exposure: {
		title: 'Model Exposure',
		icon: 'HistoricalWeather',
		route: 'exposure',
	},
	events: {
		title: 'Event Analysis',
		icon: 'TestExploreSolid',
		route: 'events',
	},
}
