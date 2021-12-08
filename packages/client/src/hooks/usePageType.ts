/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { PageType } from '~enums'

export function usePageType(): PageType {
	const location = useLocation()

	return useMemo((): PageType => {
		const name = location.pathname.split('/').pop() || ''
		return name as PageType
	}, [location])
}
