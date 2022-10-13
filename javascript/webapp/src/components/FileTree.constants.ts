/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ResourceTreeData } from '../models.js'

export const TABLE_TYPES = ['.csv', '.json']
export const ZIP_TYPES = ['.zip', '.csv', '.json']

export const appLinks: ResourceTreeData[] = [
	{
		title: 'Causal Discovery',
		icon: 'SearchData',
		route: '/discovery',
	},
	{
		title: 'Event Analysis',
		icon: 'Event',
		route: '/events',
	},
	{
		title: 'Exposure Analysis',
		icon: 'TestBeaker',
		route: '/exposure',
	},
]
