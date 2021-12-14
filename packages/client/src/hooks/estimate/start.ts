/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import { SetRunHistory } from './types'
import { NodeResponseStatus, RefutationTypes } from '~enums'
import { useUpdateRunHistory } from '~hooks'
import { CheckStatus, Graph, RunHistory } from '~interfaces'
import { checkStatus } from '~resources'
import { GenericFn } from '~types'
import { wait } from '~utils'

export const useCheckRunStatus = (): GenericFn => {
	const updateRunHistory = useUpdateRunHistory()

	return useCallback(
		async (run: RunHistory, fn: GenericFn) => {
			const [response] = await Promise.all([
				checkStatus(run.statusUrl as string),
				wait(3000),
			])
			updateRunHistory(run.id, response as CheckStatus)
			if (
				response.runtimeStatus?.toLowerCase() === NodeResponseStatus.Pending ||
				response.runtimeStatus?.toLowerCase() === NodeResponseStatus.Running
			) {
				return fn(run, fn)
			}
			return response
		},
		[updateRunHistory],
	)
}

export const useStartProcess = (
	setRunHistory: SetRunHistory,
	setRunAsDefault: GenericFn,
	refutationType: RefutationTypes,
	specCount?: number,
): GenericFn => {
	const checkRunStatus = useCheckRunStatus()
	return useCallback(
		async (run: RunHistory, graph: Graph) => {
			setRunHistory(
				prev =>
					[
						...prev.filter(p => p.runNumber !== run.runNumber),
						{ ...run, graph, refutationType },
					] as RunHistory[],
			)

			setRunAsDefault(run.id)
			checkRunStatus(run, checkRunStatus)
		},
		[setRunHistory, setRunAsDefault, checkRunStatus, specCount],
	)
}
