/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Handler } from '@showwhy/types'
import { useMemo } from 'react'

import { Pages } from '~components/App'
import { useGoToPage, usePageType } from '~hooks'

import { useSetPageDone } from '../ConsiderVariableRelationshipsPage.hooks'

export function useBusinessLogic(): {
	pageName: string
	goToRelevantVariables: Handler
} {
	const pageType = usePageType()

	const pageName: string = useMemo(() => {
		const pop = pageType.split('-')
		return pop.join(' ')
	}, [pageType])

	const goToRelevantVariables = useGoToPage(
		Pages.RelevantVariables,
		Pages.RelevantVariables,
	)
	useSetPageDone()

	return {
		pageName,
		goToRelevantVariables,
	}
}
