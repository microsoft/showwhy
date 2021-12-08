/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { renderHook } from '@testing-library/react-hooks'
import * as win from '../window'

describe('windowHook', () => {
	it('useVegaWindowDimensions', () => {
		const w = {
			height: 500,
			width: 500,
		}
		const expected = {
			width: window.innerWidth / 3.5,
			height: window.innerHeight / 2,
		}
		jest.spyOn(win, 'useWindowDimensions').mockReturnValue(w)
		const { result } = renderHook(() => win.useVegaWindowDimensions())
		const response = result.current
		expect(response).toEqual(expected)
	})
})
