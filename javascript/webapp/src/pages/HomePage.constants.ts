/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { QuestionType } from '../models.js'
import { pages } from '../pages.js'
import type { CardDetail } from './HomePage.types.js'

/**
 * Card details for the top-level questions presented in the application
 */
export const topLevelQuestionCards: CardDetail[] = [
	{
		questionType: QuestionType.Discovery,
		heroTitle: pages.discover.title,
		title: 'Do dataset features cause each other?',
		key: 'discover',
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
		questionType: QuestionType.Exposure,
		heroTitle: pages.exposure.title,
		title: 'Does an exposure cause an outcome?',
		key: 'exposure',
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
		questionType: QuestionType.Event,
		heroTitle: pages.events.title,
		title: 'Did an event cause an outcome?',
		key: 'events',
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
