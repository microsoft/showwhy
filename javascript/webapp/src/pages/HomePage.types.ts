/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ProfilePlugin } from '@datashaper/app-framework'
import type { IDocumentCardPreviewProps } from '@fluentui/react'

export interface HomePageProps {
	profiles: ProfilePlugin[]
}

export interface CardDetail {
	heroTitle: string
	title: string
	key: string
	previewProps: IDocumentCardPreviewProps
}
