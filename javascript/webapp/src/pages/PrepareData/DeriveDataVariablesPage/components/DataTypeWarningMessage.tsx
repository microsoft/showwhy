/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MessageContainer } from '@showwhy/components'
import type { FC } from 'react'
import { memo, useEffect, useState } from 'react'
import { Case, Default, Switch } from 'react-if'

import { useAllVariables, useIsDataTypeValid } from '~hooks'
import { getColumnDataTypeWarning } from '~utils'

export const DataTypeWarningMessage: FC = memo(
	function DataTypeWarningMessage() {
		const allVariables = useAllVariables()
		const [message, setMessage] = useState<string[]>([])
		const [, validColumns] = useIsDataTypeValid() || []

		useEffect(() => {
			const _message = []
			for (const column in validColumns) {
				const variable = allVariables.find(v => v.column === column)
				if (!validColumns[column] && variable?.type) {
					_message.push(getColumnDataTypeWarning(column, variable.type))
				}
			}
			setMessage(_message)
		}, [validColumns, allVariables, setMessage])

		return (
			<Switch>
				<Case condition={message.length > 0}>
					{message.map((x: string, i: number) => {
						return (
							<MessageContainer
								key={i}
								styles={{
									marginBottom: '1rem',
									width: '98%',
									marginLeft: '1%',
								}}
							>
								{x}
							</MessageContainer>
						)
					})}
				</Case>
				<Default>{null}</Default>
			</Switch>
		)
	},
)
