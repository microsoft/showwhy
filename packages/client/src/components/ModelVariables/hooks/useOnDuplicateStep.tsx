/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Step, TableStore } from '@data-wrangling-components/core'
import {
	useCreateTableName,
	useFormatedColumnArgWithCount,
} from '@data-wrangling-components/react'
import { useCallback } from 'react'

export function useOnDuplicateStep(
	store: TableStore,
	onSave?: (step: Step, index?: number) => void,
): (_step: Step) => void {
	const createTableName = useCreateTableName(store)
	const formattedColumnArgs = useFormatedColumnArgWithCount(store)

	return useCallback(
		async (_step: Step) => {
			const tableName = createTableName(_step.output)
			const formattedArgs = await formattedColumnArgs(_step)
			const dupStep = {
				..._step,
				args: formattedArgs,
				input: `${_step.output}`,
				output: tableName,
			}
			onSave && onSave(dupStep)
		},
		[onSave, createTableName, formattedColumnArgs],
	)
}
