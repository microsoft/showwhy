/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useRecoilValue } from 'recoil'

import { CausalInferenceModelState } from '../../state/index.js'

export function useIsCausalInferenceSupported(): boolean {
	const state = useRecoilValue(CausalInferenceModelState)
	return state != null
}
