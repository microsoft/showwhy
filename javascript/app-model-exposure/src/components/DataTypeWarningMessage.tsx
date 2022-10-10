/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FC } from 'react'
import { memo, useEffect, useState } from 'react'
import { Case, Default, Switch } from 'react-if'

import { useAllVariables } from '../hooks/useAllVariables.js'
import { useIsDataTypeValid } from '../hooks/validateColumnDataTypes.js'
import { useCausalFactors } from '../state/causalFactors.js'
import { useDefinitions } from '../state/definitions.js'
import { getColumnDataTypeWarning } from '../utils/assertDataType.js'
import { MessageContainer } from './MessageContainer.js'

export const DataTypeWarningMessage: FC = memo(
	function DataTypeWarningMessage() {
		const causalFactors = useCausalFactors()
		const definitions = useDefinitions()
		const allVariables = useAllVariables(causalFactors, definitions)
		const [message, setMessage] = useState('')
		const [, validColumns] = useIsDataTypeValid() || []

		useEffect(() => {
			let message = ''
			for (const column in validColumns) {
				const variable = allVariables.find(v => v.column === column)
				if (!validColumns[column] && variable?.type) {
					message += `
            ${getColumnDataTypeWarning(column, variable.type)}\n
					`
				}
			}
			setMessage(message)
		}, [validColumns, allVariables, setMessage])

		return (
			<Switch>
				<Case condition={!!message}>
					<MessageContainer
						onDismiss={() => setMessage('')}
						styles={{ marginBottom: '1rem', width: '98%', marginLeft: '1%' }}
					>
						{message}
					</MessageContainer>
				</Case>
				<Default>{null}</Default>
			</Switch>
		)
	},
)
