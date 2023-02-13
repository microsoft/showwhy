/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback, useMemo } from 'react'

import type { StatusResponse } from '../types/api/StatusResponse.js'
import type { Maybe } from '../types/primitives.js'

export function useSaveNewResponse<T extends StatusResponse>(
	recoilFn?: (valOrUpdater: T[] | ((currVal: T[]) => T[])) => void,
): (id: string, result: T) => void {
	return useCallback(
		(id: string, result: T) => {
			recoilFn?.((prev: T[]) => {
				const existing = prev.find((p) => p.taskId === id)
				const newOne = {
					taskId: id,
					...result,
				}

				return [
					...prev.filter((p) => p.taskId !== existing?.taskId),
					newOne,
				] as T[]
			})
		},
		[recoilFn],
	)
}

export function useReturnDefaultResponse<T extends StatusResponse>(
	responseList: T[],
	id?: string,
): Maybe<T> {
	return useMemo(() => {
		if (!responseList.length) return undefined
		return responseList.find((e) => e.taskId === id)
	}, [responseList, id])
}
