/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { pages } from '../pages.js'
import type { CardDetail } from './HomePage.types.js'

/**
 * Card details for the top-level questions presented in the application
 */
export const topLevelQuestionCards: CardDetail[] = [
	{
		heroTitle: pages.discover.title,
		title: 'Do dataset features cause each other?',
		key: 'showwhy-discover',
		previewProps: {
			previewImages: [
				{
					previewIconProps: {
						iconName: pages.discover.icon,
					},
				},
			],
		},
	},
	{
		heroTitle: pages.exposure.title,
		title: 'Does an exposure cause an outcome?',
		key: 'showwhy-model-exposure',
		previewProps: {
			previewImages: [
				{
					previewIconProps: {
						iconName: pages.exposure.icon,
					},
				},
			],
		},
	},
	{
		heroTitle: pages.events.title,
		title: 'Did an event cause an outcome?',
		key: 'showwhy-events',
		previewProps: {
			previewImages: [
				{
					previewIconProps: {
						iconName: pages.events.icon,
					},
				},
			],
		},
	},
]
