/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

const TABLE_ARG = 'table'
const RESOURCE_ARG = 'resource'

export interface WrangleParameters {
	table: string | undefined
	resource: string | undefined
}
export function useWrangleParameters(): WrangleParameters {
	const location = useLocation()
	const search = useMemo(
		() => new URLSearchParams(location.search),
		[location.search],
	)

	return useMemo<WrangleParameters>(() => {
		const table = search.get(TABLE_ARG) ?? undefined
		const resource = search.get(RESOURCE_ARG) ?? undefined
		return { table, resource }
	}, [search])
}
