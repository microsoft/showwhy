/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MessageContainer } from '@showwhy/components'
import type { FC } from 'react'
import { memo, useEffect, useState } from 'react'
import { Case, Default, Switch } from 'react-if'

import { useAllVariables, useIsDataTypeValid } from '~hooks'
import { useCausalFactors, useDefinitions } from '~state'
import { getColumnDataTypeWarning } from '~utils'

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
