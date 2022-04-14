/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { MessageContainer } from '@showwhy/components'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { Pages } from '~components/App'
import { useIsMicrodata } from '~hooks'
import { useOutputTablePrep, useSubjectIdentifier } from '~state'

export function useMicrodataInfoMessage(): JSX.Element | null {
	const outputTable = useOutputTablePrep()
	const subjectIndentifier = useSubjectIdentifier()
	const isMicrodata = useIsMicrodata()

	return useMemo(() => {
		if (!outputTable) {
			return null
		}
		const showInfoMessage =
			!!subjectIndentifier && !isMicrodata(outputTable, subjectIndentifier)

		return showInfoMessage ? (
			<MessageContainer styles={{ marginBottom: '1rem' }}>
				<span>
					Data contains more than one record per subject. Go back to
					<Link to={Pages.DeriveDataVariables}>
						Derive data variables page
					</Link>{' '}
					and ensure they only have one.
				</span>
			</MessageContainer>
		) : null
	}, [outputTable, subjectIndentifier, isMicrodata])
}
