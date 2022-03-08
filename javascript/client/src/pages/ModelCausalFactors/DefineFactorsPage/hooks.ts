/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Handler } from '@showwhy/types'
import { upperFirst } from 'lodash'
import { useMemo } from 'react'

import { useGoToPage, usePageType } from '~hooks'
import { Pages } from '~types'

export function useBusinessLogic(): {
	pageName: string
	causeType: string
	tableHeader: Array<{ fieldName: string; value: string }>
	goToConsiderCausalFactors: Handler
} {
	const { pageName, causeType, question } = usePageComponents()
	const tableHeader = useTableHeader(question)
	const goToConsiderCausalFactors = useGoToConsiderCausalFactors()

	return {
		pageName,
		causeType,
		tableHeader,
		goToConsiderCausalFactors,
	}
}

function usePageComponents(): {
	pageName: string
	causeType: string
	question: string
} {
	const pageType = usePageType()

	const pageName: string = useMemo(() => {
		const pop = pageType.split('-')
		return pop.join(' ')
	}, [pageType])

	const causeType: string = useMemo(() => {
		const pop = pageType.split('-').map((x, i) => (i > 0 ? upperFirst(x) : x))
		return pop.join('')
	}, [pageType])

	const question = useMemo((): string => {
		return upperFirst(pageName) + '?'
	}, [pageName])
	return { pageName, causeType, question }
}

function useTableHeader(
	question: string,
): Array<{ fieldName: string; value: string }> {
	return useMemo(() => {
		return [
			{ fieldName: 'variable', value: 'Factor' },
			{ fieldName: 'causes', value: question },
			{ fieldName: 'degree', value: 'Degree of Belief' },
			{ fieldName: 'reasoning', value: 'Reasoning' },
		]
	}, [question])
}

function useGoToConsiderCausalFactors(): Handler {
	const pageType = usePageType()
	return useGoToPage(Pages.ConsiderCausalFactors, pageType)
}
