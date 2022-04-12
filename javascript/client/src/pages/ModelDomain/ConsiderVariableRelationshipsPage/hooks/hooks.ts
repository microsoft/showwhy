/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Handler } from '@showwhy/types'
import { useMemo } from 'react'

import { useGoToPage, usePageType } from '~hooks'
import { Pages } from '~types'

import { useSetDonePage } from './useSetPageDone'

export function useBusinessLogic(): {
	pageName: string
	goToRelevantVariables: Handler
} {
	const { pageName } = usePageComponents()
	const goToRelevantVariables = useGoToPage(
		Pages.RelevantVariables,
		Pages.RelevantVariables,
	)
	useSetDonePage()

	return {
		pageName,
		goToRelevantVariables,
	}
}

function usePageComponents(): {
	pageName: string
} {
	const pageType = usePageType()

	const pageName: string = useMemo(() => {
		const pop = pageType.split('-')
		return pop.join(' ')
	}, [pageType])

	return { pageName }
}
