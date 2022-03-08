/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IComboBoxOption } from '@fluentui/react'
import { useMemo } from 'react'

import { useOutputTablePrep } from '~state'

export function useVariableOptions(): IComboBoxOption[] {
	const outputTable = useOutputTablePrep()

	return useMemo(() => {
		const validColumns = outputTable?.columnNames()?.map(x => {
			return { key: x, text: x }
		})
		return validColumns || []
	}, [outputTable])
}
