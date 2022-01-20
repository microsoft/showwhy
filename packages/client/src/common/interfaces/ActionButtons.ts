/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export interface ActionButtonsProps {
	onCancel?: () => void
	onSave?: () => void
	onEdit?: () => void
	onDelete?: () => void
	onDuplicate?: () => void
	onFavorite?: () => void
	favoriteProps?: {
		isFavorite: boolean
		title?: string
	}
	infoButton?: { id: string; text: string }
	disableSave?: boolean | undefined
}
