/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useMemo, useState } from 'react'
import { MessageContainer } from '~components/MessageContainer'
import { useIsMicrodata } from '~hooks'
import { useOutputTablePrep, useSubjectIdentifier } from '~state'

export function useMicrodataInfoMessage(): JSX.Element | null {
	const outputTable = useOutputTablePrep()
	const subjectIndeitifier = useSubjectIdentifier()
	const isMicrodata = useIsMicrodata()
	const [showInfoMessage, setShowInfoMessage] = useState<boolean>(false)

	return useMemo(() => {
		if (!outputTable || !subjectIndeitifier) {
			return null
		}
		const missing = !isMicrodata(outputTable, subjectIndeitifier)
		setShowInfoMessage(missing)

		return showInfoMessage ? (
			<MessageContainer styles={{ marginTop: '1rem' }}>
				<span>
					Looks like some variables were not assigned, go back to the fix this.
				</span>
			</MessageContainer>
		) : null
	}, [setShowInfoMessage, showInfoMessage, outputTable, subjectIndeitifier])
}
