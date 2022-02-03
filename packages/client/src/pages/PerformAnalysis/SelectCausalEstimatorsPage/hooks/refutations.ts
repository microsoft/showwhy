/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useMemo } from 'react'
import { useSetFullRefutation, useSetQuickRefutation } from '~hooks'
import { useRefutationType } from '~state'
import { RefutationType, RefutationChoice } from '~types'

export function useRefutations(): {
	refutationOptions: RefutationChoice[]
} {
	const refutation = useRefutationType()
	const setQuickRefutation = useSetQuickRefutation()
	const setFullRefutation = useSetFullRefutation()

	const refutationOptions = useMemo(() => {
		return [
			{
				key: RefutationType.QuickRefutation,
				title: 'Quick refutation',
				description:
					'Run refutation with 10 simulations. Could be used for a quick check of estimated effects before the final analysis​.',
				isSelected: refutation === RefutationType.QuickRefutation,
				onChange: setQuickRefutation,
			},
			{
				key: RefutationType.FullRefutation,
				title: 'Full refutation',
				description:
					'Run refutation with 100 simulations. May take a while to run, but should be selected for final analysis.​',
				isSelected: refutation === RefutationType.FullRefutation,
				onChange: setFullRefutation,
			},
		]
	}, [refutation, setQuickRefutation, setFullRefutation])

	return {
		refutationOptions,
	}
}
