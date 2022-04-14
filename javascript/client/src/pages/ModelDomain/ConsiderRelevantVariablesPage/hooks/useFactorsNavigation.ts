/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Handler, Maybe } from '@showwhy/types'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { noop } from '~utils'

import { Pages } from '../../../../constants'
import type { PathData } from '../ConsiderRelevantVariablesPage.types'

export function useFactorsNavigation(): [Handler, PathData] {
	const history = useHistory()
	const [historyState, setHistoryState] = useState<string>()
	const factorsPathData = useFactorsPathData(historyState)
	useEffect(() => {
		history.location.state && setHistoryState(history.location.state as string)
	}, [history.location.state, setHistoryState])

	const goToVariableRelationships = useCallback(() => {
		history.push(Pages.VariablesRelationships)
		setHistoryState(undefined)
	}, [setHistoryState, history])

	return [
		factorsPathData?.path ? goToVariableRelationships : noop,
		factorsPathData,
	]
}

function useFactorsPathData(historyState: Maybe<string>): PathData {
	return useMemo((): PathData => {
		return {
			path: historyState,
			page: historyState?.replace(/[/-]/g, ' '),
		}
	}, [historyState])
}
