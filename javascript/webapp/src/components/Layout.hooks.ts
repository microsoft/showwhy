/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useLocation, useNavigate } from 'react-router-dom'
import { useMemo, useCallback } from 'react'
import type { ResourceTreeData } from '@datashaper/app-framework'

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
