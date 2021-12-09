/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { renderHook } from '@testing-library/react-hooks'
import { usePageType } from '../usePageType'

var mockRouter = jest.requireActual('react-router-dom')
jest.mock('react-router-dom', () => ({
	...mockRouter,
	useLocation: () => ({
		pathname: 'localhost:3000/prepare/columns',
	}),
}))

it('should return the page type', () => {
	const { result } = renderHook(() => usePageType())
	expect(result.current).toBe('columns')
})
