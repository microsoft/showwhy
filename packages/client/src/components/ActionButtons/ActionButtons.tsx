/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton, IIconProps } from '@fluentui/react'
import { memo, useMemo } from 'react'
import styled from 'styled-components'
import { InfoCallout } from '~components/Callout'
import { Text } from '~styles'
import { Handler0 } from '~types'

const DEFAULT_FAVORITE_PROPS = Object.freeze({ isFavorite: false, title: '' })

export interface ActionButtonsProps {
	onCancel?: Handler0
	onSave?: Handler0
	onEdit?: Handler0
	onDelete?: Handler0
	onDuplicate?: Handler0
	onFavorite?: Handler0
	favoriteProps?: {
		isFavorite: boolean
		title?: string
	}
	infoButton?: { id: string; text: string }
	disableSave?: boolean
}

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
					/>
				)}
				{onCancel && (
					<IconButton
						iconProps={iconProps.cancel}
						title="Cancel"
						ariaLabel="Cancel Emoji"
						onClick={onCancel}
					/>
				)}
				{onEdit && (
					<IconButton
						iconProps={iconProps.edit}
						title="Edit"
						ariaLabel="Edit Emoji"
						onClick={onEdit}
					/>
				)}
				{onDuplicate && (
					<IconButton
						iconProps={iconProps.duplicate}
						title="Duplicate"
						ariaLabel="DuplicateRow Emoji"
						onClick={onDuplicate}
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
					/>
				)}
				{onDelete && (
					<IconButton
						iconProps={iconProps.delete}
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

const iconProps = {
	save: { iconName: 'Save' },
	cancel: { iconName: 'Cancel' },
	edit: { iconName: 'Edit' },
	duplicate: { iconName: 'DuplicateRow' },
	delete: { iconName: 'Delete' },
}
