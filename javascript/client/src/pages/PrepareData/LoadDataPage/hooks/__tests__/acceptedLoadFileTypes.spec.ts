/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { renderHook } from '@testing-library/react-hooks'
import { RecoilRoot } from 'recoil'

import { LOAD_FILE_TYPES, LOAD_ZIP_TYPES } from '../../LoadDataPage.constants'
import { useAcceptedLoadFileTypes } from '../useAcceptedLoadFileTypes'

it('supportedFileTypes', () => {
	const expected = [...LOAD_FILE_TYPES, ...LOAD_ZIP_TYPES]

	const { result } = renderHook(() => useAcceptedLoadFileTypes(), {
		wrapper: RecoilRoot,
	})
	const response = result.current
	expect(response).toEqual(expected)
})
