/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useBoolean } from '@fluentui/react-hooks'
import type { Handler1, Maybe, NodeRequest } from '@showwhy/types'
import { useEffect } from 'react'

import { api } from '~resources'
import { useSetSpecCount } from '~state'

export function useLoadSpecCount(
	estimateNode: Maybe<NodeRequest>,
	isProcessing: boolean,
	setErrors: Handler1<string>,
): boolean {
	const [loading, { setTrue: trueLoading, setFalse: falseLoading }] =
		useBoolean(false)
	const setSpecCount = useSetSpecCount()

	useEffect(() => {
		if (!estimateNode || isProcessing) return
		trueLoading()
		setErrors('')
		api
			.numberExecutions(estimateNode)
			.then(res => {
				setSpecCount(res.total_executions)
			})
			.catch(err => {
				setErrors(
					err.message || 'Unknown error, please contact the system admin.',
				)
			})
			.finally(() => falseLoading())
	}, [
		isProcessing,
		setSpecCount,
		estimateNode,
		setErrors,
		trueLoading,
		falseLoading,
	])

	return loading
}
