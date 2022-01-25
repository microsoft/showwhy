/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton } from '@fluentui/react'
import { memo } from 'react'
import styled from 'styled-components'
import { InfoCallout } from '~components/Callout'
import { ActionButtonsProps } from '~interfaces'
import { Text } from '~styles'

export const ActionButtons: React.FC<ActionButtonsProps> = memo(
	function ActionButtons({
		onCancel,
		onSave,
		onEdit,
		onDelete,
		onDuplicate,
		onFavorite,
		favoriteProps,
		infoButton,
		disableSave = false,
	}) {
		return (
			<Container>
				{!!onSave && (
					<IconButton
						onClick={onSave}
						iconProps={{ iconName: 'Save' }}
						title="Save"
						ariaLabel="Save Emoji"
						disabled={disableSave}
					/>
				)}
				{!!onCancel && (
					<IconButton
						iconProps={{ iconName: 'Cancel' }}
						title="Cancel"
						ariaLabel="Cancel Emoji"
						onClick={onCancel}
					/>
				)}
				{!!onEdit && (
					<IconButton
						iconProps={{ iconName: 'Edit' }}
						title="Edit"
						ariaLabel="Edit Emoji"
						onClick={onEdit}
					/>
				)}
				{!!onDuplicate && (
					<IconButton
						iconProps={{ iconName: 'DuplicateRow' }}
						title="Duplicate"
						ariaLabel="DuplicateRow Emoji"
						onClick={onDuplicate}
					/>
				)}
				{!!infoButton && (
					<InfoCallout id={infoButton.id}>
						<Text>{infoButton.text}</Text>
					</InfoCallout>
				)}
				{!!onFavorite && (
					<IconButton
						iconProps={{
							iconName: `FavoriteStar${
								favoriteProps?.isFavorite ? 'Fill' : ''
							}`,
						}}
						title={favoriteProps?.title || 'Favorite'}
						ariaLabel="FavoriteStar Emoji"
						onClick={onFavorite}
					/>
				)}
				{!!onDelete && (
					<IconButton
						iconProps={{ iconName: 'Delete' }}
						title="Delete"
						ariaLabel="Delete Emoji"
						onClick={onDelete}
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
