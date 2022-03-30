/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Link } from '@fluentui/react'
import { useMemo, useState } from 'react'

import { MessageContainer } from '~components/MessageContainer'
import { useIsMicrodata } from '~hooks'
import { useOutputTablePrep, useSubjectIdentifier } from '~state'

export function useMicrodataInfoMessage(): JSX.Element | null {
	const outputTable = useOutputTablePrep()
	const subjectIndentifier = useSubjectIdentifier()
	const isMicrodata = useIsMicrodata()
	const [showInfoMessage, setShowInfoMessage] = useState<boolean>(false)

	return useMemo(() => {
		if (!outputTable) {
			return null
		}
		const missing =
			!isMicrodata(outputTable, subjectIndentifier) || !subjectIndentifier
		setShowInfoMessage(missing)

		return showInfoMessage ? (
			<MessageContainer styles={{ marginTop: '1rem' }}>
				{!subjectIndentifier ? (
					<span>
						You must assign a subject identifier column so we can check that
						there&apos;s only one record per subject. Go back to{' '}
						<Link to="/prepare/data">Process Data Page</Link> and ensure a
						column is selected.
					</span>
				) : (
					<span>
						Data contains more than one record per subject. Go back to{' '}
						<Link to="/prepare/data">Process Data Page</Link> and ensure they
						only have one.
					</span>
				)}
			</MessageContainer>
		) : null
	}, [
		setShowInfoMessage,
		showInfoMessage,
		outputTable,
		subjectIndentifier,
		isMicrodata,
	])
}
