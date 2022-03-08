/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { renderHook } from '@testing-library/react-hooks'

import * as win from '../window'

describe('windowHook', () => {
	it('useVegaWindowDimensions', () => {
		const expected = {
			width: window.innerWidth / 3.5,
			height: window.innerHeight / 2,
		}
		const { result } = renderHook(() =>
			win.useVegaWindowDimensionsTestable({
				height: 500,
				width: 500,
			}),
		)
		const response = result.current
		expect(response).toEqual(expected)
	})
})
