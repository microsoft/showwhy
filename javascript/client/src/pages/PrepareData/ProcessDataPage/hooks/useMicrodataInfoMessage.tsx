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
		if (!outputTable || !subjectIndentifier) {
			return null
		}
		const missing = !isMicrodata(outputTable, subjectIndentifier)
		setShowInfoMessage(missing)

		return showInfoMessage ? (
			<MessageContainer styles={{ marginTop: '1rem' }}>
				<span>
					Looks like you table is not a microdata. Go back to{' '}
					<Link to="/prepare/data">Process Data Page</Link> to fix this.
				</span>
			</MessageContainer>
		) : null
	}, [setShowInfoMessage, showInfoMessage, outputTable, subjectIndentifier])
}
