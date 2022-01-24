/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useMemo } from 'react'
import { RefutationTypes } from '~enums'
import { useSetFullRefutation, useSetQuickRefutation } from '~hooks'
import { useRefutationType } from '~state'

export function useRefutations(): {
	refutationOptions: Array<{
		key: RefutationTypes
		title: string
		description: string
		isSelected: boolean
		onChange: () => void
	}>
} {
	const refutation = useRefutationType()
	const setQuickRefutation = useSetQuickRefutation()
	const setFullRefutation = useSetFullRefutation()

	const refutationOptions = useMemo(() => {
		return [
			{
				key: RefutationTypes.QuickRefutation,
				title: 'Quick refutation',
				description:
					'Run refutation with 10 simulations. Could be used for a quick check of estimated effects before the final analysis​.',
				isSelected: refutation === RefutationTypes.QuickRefutation,
				onChange: setQuickRefutation,
			},
			{
				key: RefutationTypes.FullRefutation,
				title: 'Full refutation',
				description:
					'Run refutation with 100 simulations. May take a while to run, but should be selected for final analysis.​',
				isSelected: refutation === RefutationTypes.FullRefutation,
				onChange: setFullRefutation,
			},
		]
	}, [refutation, setQuickRefutation, setFullRefutation])

	return {
		refutationOptions,
	}
}
