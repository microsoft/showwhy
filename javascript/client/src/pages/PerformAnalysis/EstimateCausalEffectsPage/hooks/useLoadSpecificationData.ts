/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Specification } from '@showwhy/types'
import { csv } from 'd3-fetch'
import { useEffect, useState } from 'react'

import { useDefaultRun } from '~hooks'
import { useDefaultDatasetResult } from '~state'

import { row2spec } from '../EstimateCausalEffectPage.utils'

export function useLoadSpecificationData(): Specification[] {
	const [data, setData] = useState<Specification[]>([])
	const defaultRun = useDefaultRun()
	const defaultDatasetResult = useDefaultDatasetResult()

	useEffect(() => {
		if (defaultRun) {
			if (!defaultRun.result?.length) {
				setData([])
			} else {
				const result = defaultRun.result.map((x: any, index) => {
					const n = { ...x, Specification_ID: index + 1 }
					return row2spec(n)
				}) as Specification[]
				const newResult = result
					?.sort(function (a, b) {
						return a?.estimatedEffect - b?.estimatedEffect
					})
					.map((x, index) => ({ ...x, id: index + 1 }))

				setData(newResult)
			}
		} else if (!defaultRun) {
			if (defaultDatasetResult) {
				const f = async () => {
					try {
						const result = await csv(defaultDatasetResult?.url, row2spec)
						setData(result.map((x, index) => ({ ...x, id: index + 1 })))
					} catch (err) {
						setData([])
					}
				}
				f()
			}
		}
	}, [setData, defaultRun, defaultDatasetResult])
	return data
}
