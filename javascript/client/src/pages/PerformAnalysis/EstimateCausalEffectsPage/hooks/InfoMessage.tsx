/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { MessageContainer } from '~components/MessageContainer'
import { useAllVariables } from '~hooks'
import { useCausalFactors, useExperiment } from '~state'

export function useInfoMessage(): JSX.Element | null {
	const definitions = useExperiment()
	const causalFactors = useCausalFactors()
	const allVariables = useAllVariables(causalFactors, definitions)
	const [showInfoMessage, setShowInfoMessage] = useState<boolean>(false)
	return useMemo(() => {
		const missing = allVariables.some(v => !v.column)
		setShowInfoMessage(missing)
		return showInfoMessage ? (
			<MessageContainer styles={{ marginTop: '1rem' }}>
				<span>
					Looks like some variables were not assigned, go back to the{' '}
					<Link to="/prepare/data">Process Data Page</Link> to fix this.
				</span>
			</MessageContainer>
		) : null
	}, [setShowInfoMessage, showInfoMessage, allVariables])
}
