/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ImageFit } from '@fluentui/react'

import { QuestionType } from '../models.js'
import { pages } from '../pages.js'
import type { CardDetail } from './HomePage.types.js'

/**
 * TODO: temp preview props - replace with useful iconographic images for the
 * top-level questions
 */
const previewProps = {
	previewImages: [
		{
			name: 'Revenue stream proposal fiscal year 2016 version02.pptx',
			linkProps: {
				href: 'http://bing.com',
				target: '_blank',
			},
			imageFit: ImageFit.cover,
			width: 318,
			height: 196,
		},
	],
}

/**
 * Card details for the top-level questions presented in the application
 */
export const topLevelQuestionCards: CardDetail[] = [
	{
		questionType: QuestionType.Event,
		heroTitle: 'Event',
		title: 'Did an event cause an outcome?',
		href: pages.events.route,
		previewProps,
	},
	{
		questionType: QuestionType.Exposure,
		heroTitle: 'Exposure',
		title: 'Does an exposure cause an outcome?',
		href: pages.exposure.route,
		previewProps,
	},
	{
		questionType: QuestionType.Exploratory,
		heroTitle: 'Exploratory',
		title: 'Do dataset features cause each other?',
		href: pages.explore.route,
		previewProps,
	},
]
