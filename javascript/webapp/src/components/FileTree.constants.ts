/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ResourceTreeData } from '../models.js'
import { pages } from '../pages.js'

export const TABLE_TYPES = ['.csv', '.json']
export const ZIP_TYPES = ['.zip', '.csv', '.json']

export const appLinks: ResourceTreeData[] = [
	{
		title: 'Causal Discovery',
		icon: pages.discover.icon,
		route: `/${pages.discover.route}`,
	},
	{
		title: 'Exposure Analysis',
		icon: pages.exposure.icon,
		route: `/${pages.exposure.route}`,
	},
	{
		title: 'Event Analysis',
		icon: pages.events.icon,
		route: `/${pages.events.route}`,
	},
]
