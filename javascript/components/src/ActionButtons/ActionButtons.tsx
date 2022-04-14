/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IIconProps } from '@fluentui/react'
import { IconButton } from '@fluentui/react'
import { InfoCallout } from '@showwhy/components'
import { memo, useMemo } from 'react'
import styled from 'styled-components'

import { DEFAULT_FAVORITE_PROPS } from './ActionButtons.constants.js'
import type { ActionButtonsProps } from './ActionButtons.types.js'

export const ActionButtons: React.FC<ActionButtonsProps> = memo(
	function ActionButtons({
		onCancel,
		onSave,
		onEdit,
		onDelete,
		onDuplicate,
		onFavorite,
		favoriteProps = DEFAULT_FAVORITE_PROPS,
		infoButton,
		disableSave = false,
	}) {
		const favoriteIconProps = useMemo<IIconProps>(
			() => ({
				iconName: `FavoriteStar${favoriteProps.isFavorite ? 'Fill' : ''}`,
			}),
			[favoriteProps.isFavorite],
		)
		return (
			<Container>
				{onSave && (
					<IconButton
						onClick={onSave}
						iconProps={iconProps.save}
						title="Save"
						ariaLabel="Save Emoji"
						disabled={disableSave}
						data-pw="save-button"
					/>
				)}
				{onCancel && (
					<IconButton
						iconProps={iconProps.cancel}
						title="Cancel"
						ariaLabel="Cancel Emoji"
						onClick={onCancel}
						data-pw="cancel-button"
					/>
				)}
				{onEdit && (
					<IconButton
						iconProps={iconProps.edit}
						title="Edit"
						ariaLabel="Edit Emoji"
						onClick={onEdit}
						data-pw="edit-button"
					/>
				)}
				{onDuplicate && (
					<IconButton
						iconProps={iconProps.duplicate}
						title="Duplicate"
						ariaLabel="DuplicateRow Emoji"
						onClick={onDuplicate}
						data-pw="duplicate-button"
					/>
				)}
				{infoButton && (
					<InfoCallout id={infoButton.id}>
						<Text>{infoButton.text}</Text>
					</InfoCallout>
				)}
				{onFavorite && (
					<IconButton
						iconProps={favoriteIconProps}
						title={favoriteProps?.title || 'Favorite'}
						ariaLabel="FavoriteStar Emoji"
						onClick={onFavorite}
						data-pw="favorite-button"
					/>
				)}
				{onDelete && (
					<IconButton
						iconProps={iconProps.delete}
						title="Delete"
						ariaLabel="Delete Emoji"
						onClick={onDelete}
						data-pw="delete-button"
					/>
				)}
			</Container>
		)
	},
)

const Container = styled.div`
	display: flex;
	justify-content: center;
`

const iconProps = {
	save: { iconName: 'Save' },
	cancel: { iconName: 'Cancel' },
	edit: { iconName: 'Edit' },
	duplicate: { iconName: 'DuplicateRow' },
	delete: { iconName: 'Delete' },
}

const Text = styled.span``
