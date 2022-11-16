/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ResourceTreeData } from '@datashaper/app-framework'
import { useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export function useCurrentPath(): string {
	const location = useLocation()
	return useMemo(() => `${location.pathname}${location.search}`, [location])
}

export function useOnSelectItem(): ({ route }: ResourceTreeData) => void {
	const navigate = useNavigate()
	return useCallback(
		({ route }: ResourceTreeData) => navigate(`${route}`),
		[navigate],
	)
}
