/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { MessageContainer } from '~components/MessageContainer'
import { useOutputTablePrep, useSubjectIdentifier } from '~state'
import { Pages } from '~types'

export function useSubjectIdentifierMissingMessage(): JSX.Element | null {
	const outputTable = useOutputTablePrep()
	const subjectIndentifier = useSubjectIdentifier()

	return useMemo(() => {
		if (!outputTable) {
			return null
		}

		return !subjectIndentifier ? (
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
		) : null
	}, [outputTable, subjectIndentifier])
}
