/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { MessageContainer } from '~components/MessageContainer'
import { useAllVariables } from '~hooks'
import { useCausalFactors, useExperiment } from '~state'
import { Pages } from '~types'

export function useVariablesMissingMessage(): JSX.Element | null {
	const definitions = useExperiment()
	const causalFactors = useCausalFactors()
	const allVariables = useAllVariables(causalFactors, definitions)

	return useMemo(() => {
		return allVariables.some(v => !v.column) ? (
			<MessageContainer styles={{ marginBottom: '1rem' }}>
				<span>
					Looks like some variables were not assigned, go back to
					<Link to={Pages.DeriveDataVariables}>
						Derive data variables page
					</Link>{' '}
					to fix this.
				</span>
			</MessageContainer>
		) : null
	}, [allVariables])
}
