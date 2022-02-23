/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Specification, Step } from '@data-wrangling-components/core'
import { useMemo } from 'react'
import { isArray } from 'lodash'
import { Maybe } from '~types'

export function useActualSteps(
	selectedSpecification: Maybe<Specification>,
	selectedColumns: string[],
): Step[] {
	return useMemo((): Step[] => {
		return (
			selectedSpecification?.steps?.filter(a => {
				const args = a.args as Record<string, unknown>
				if (!isArray(args['to'])) {
					return selectedColumns?.includes(args['to'] as string)
				}
				return false
			}) || []
		)
	}, [selectedSpecification, selectedColumns])
}
