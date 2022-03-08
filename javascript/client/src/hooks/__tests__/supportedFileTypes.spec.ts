/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { renderHook } from '@testing-library/react-hooks'
import { RecoilRoot } from 'recoil'

import { FILE_TYPES, useSupportedFileTypes } from '../supportedFileTypes'
it('supportedFileTypes', () => {
	const expected = FILE_TYPES

	const { result } = renderHook(() => useSupportedFileTypes(), {
		wrapper: RecoilRoot,
	})
	const response = result.current
	expect(response).toEqual(expected)
})
