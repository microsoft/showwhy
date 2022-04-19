/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MessageContainer } from '@showwhy/components'
import { FC, memo } from 'react'
import { Link } from 'react-router-dom'
import { Pages } from 'src/constants'

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
