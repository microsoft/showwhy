/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { upperFirst } from 'lodash'
import { useCallback, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { usePageType } from '~hooks'
import { GenericObject } from '~types'

export function useBusinessLogic(): GenericObject {
	const pageType = usePageType()
	const history = useHistory()

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

	const tableHeader = useMemo(() => {
		return [
			{ fieldName: 'variable', value: 'Factor' },
			{ fieldName: 'causes', value: question },
			{ fieldName: 'degree', value: 'Degree of Belief' },
			{ fieldName: 'reasoning', value: 'Reasoning' },
		]
	}, [question])

	const goToConsiderCausalFactors = useCallback(() => {
		history.push('/define/causalFactors')
		history.location.state = pageType
	}, [history, pageType])

	return {
		pageName,
		causeType,
		tableHeader,
		goToConsiderCausalFactors,
	}
}
