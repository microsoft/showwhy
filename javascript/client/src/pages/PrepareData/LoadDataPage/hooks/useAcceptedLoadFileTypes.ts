/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useMemo } from 'react'

import { LOAD_FILE_TYPES, LOAD_ZIP_TYPES } from '../LoadDataPage.constants'

export function useAcceptedLoadFileTypes(): string[] {
	return useMemo(() => [...LOAD_FILE_TYPES, ...LOAD_ZIP_TYPES], [])
}
