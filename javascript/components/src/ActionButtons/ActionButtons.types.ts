/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Handler } from '@showwhy/types'

export interface ActionButtonsProps {
	onCancel?: Handler
	onSave?: Handler
	onEdit?: Handler
	onDelete?: Handler
	onDuplicate?: Handler
	onFavorite?: Handler
	favoriteProps?: {
		isFavorite: boolean
		title?: string
	}
	infoButton?: { id: string; text: string }
	disableSave?: boolean
}
