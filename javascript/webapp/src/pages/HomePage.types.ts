/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IDocumentCardPreviewProps } from '@fluentui/react'

import type { QuestionType } from '../models.js'

export interface CardDetail {
	questionType: QuestionType
	heroTitle: string
	title: string
	key: string
	previewProps: IDocumentCardPreviewProps
}
