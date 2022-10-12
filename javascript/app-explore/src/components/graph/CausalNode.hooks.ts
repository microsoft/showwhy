/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useRecoilValue } from 'recoil'

import { InModelColumnNamesState } from '../../state/index.js'

export function useIsVariableInModel(name: string): boolean {
	const inModelColumnNames = useRecoilValue(InModelColumnNamesState)
	return inModelColumnNames.includes(name)
}
