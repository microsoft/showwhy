/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import { useSetStepsOutputTablePrep } from '~state'
import { Handler1 } from '~types'

export function useStartPipeline(): Handler1<string> {
	const setOutput = useSetStepsOutputTablePrep()

	return useCallback(
		(inputTable: string) => {
			//create index column for the table
			const step = {
				type: 'verb',
				verb: 'select',
				input: inputTable,
				output: 'select-0',
				args: {
					columns: ['index'],
				},
			}
			setOutput([step])
		},
		[setOutput],
	)
}
// add index step
// return steps
// remove index steps
