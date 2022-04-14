/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import type { PageType } from '~components/App'

export function usePageType(): PageType {
	const location = useLocation()
	return usePageTypeTestable(location.pathname)
}

export function usePageTypeTestable(pathname: string): PageType {
	return useMemo((): PageType => {
		const name = pathname.split('/').pop() || ''
		return name as PageType
	}, [pathname])
}
