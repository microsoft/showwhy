/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MessageContainer } from '@showwhy/components'
import type { FC } from 'react'
import { memo } from 'react'
import { Link } from 'react-router-dom'

import { Pages } from '~constants'

export const MicrodataMessage: FC = memo(function MicrodataMessage() {
	return (
		<MessageContainer styles={{ marginBottom: '1rem' }}>
			<span>
				Data contains more than one record per subject. Go back to
				<Link to={Pages.DeriveDataVariables}>
					Derive data variables page
				</Link>{' '}
				and ensure they only have one.
			</span>
		</MessageContainer>
	)
})

export const VariablesMessage: FC = memo(function VariablesMessage() {
	return (
		<MessageContainer styles={{ marginBottom: '1rem' }}>
			<span>
				Looks like some variables were not assigned, go back to
				<Link to={Pages.DeriveDataVariables}>
					Derive data variables page
				</Link>{' '}
				to fix this.
			</span>
		</MessageContainer>
	)
})

export const IdentifierMessage: FC = memo(function IdentifierMessage() {
	return (
		<MessageContainer styles={{ marginBottom: '1rem' }}>
			<span>
				You must assign a subject identifier column so we can check that
				there&apos;s only one record per subject. Go back to
				<Link to={Pages.DeriveDataVariables}>
					Derive data variables page
				</Link>{' '}
				and ensure a column is selected.
			</span>
		</MessageContainer>
	)
})

export const OutputTableColumnsMessage: FC = memo(
	function OutputTableColumnsMessage() {
		return (
			<MessageContainer styles={{ marginBottom: '1rem' }}>
				<span>
					Looks like some variables have been assigned but they are not mapped
					in the output table, go back to
					<Link to={Pages.DeriveDataVariables}>
						Derive data variables page
					</Link>{' '}
					to fix this.
				</span>
			</MessageContainer>
		)
	},
)

export const ColumnDataTypeMessage: FC = memo(function ColumnDataTypeMessage() {
	return (
		<MessageContainer styles={{ marginBottom: '1rem' }}>
			<span>
				Looks like some columns have an invalid data type according to the
				variable type that have been assigned to them, go back to
				<Link to={Pages.DeriveDataVariables}>
					Derive data variables page
				</Link>{' '}
				to fix this.
			</span>
		</MessageContainer>
	)
})
