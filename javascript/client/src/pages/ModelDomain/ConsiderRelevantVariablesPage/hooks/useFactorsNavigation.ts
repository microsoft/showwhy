/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Handler, Maybe } from '@showwhy/types'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { noop } from '~utils'

import { Pages } from '../../../../constants'
import type { PathData } from '../ConsiderRelevantVariablesPage.types'

export function useFactorsNavigation(): [Handler, PathData] {
	const history = useHistory()
	const [historyState, setHistoryState] = useState<string>()
	const factorsPathData = getFactorsPathData(historyState)
	useEffect(() => {
		history.location.state && setHistoryState(history.location.state as string)
	}, [history.location.state, setHistoryState])

	return [
		factorsPathData?.path
			? () => goToVariableRelationships(history, setHistoryState)
			: noop,
		factorsPathData,
	]
}

function getFactorsPathData(historyState: Maybe<string>): PathData {
	return {
		path: historyState,
		page: historyState?.replace(/[/-]/g, ' '),
	}
}

function goToVariableRelationships(
	history: any,
	setHistoryState: (value?: string) => void,
): void {
	history.push(Pages.VariablesRelationships)
	setHistoryState(undefined)
}
