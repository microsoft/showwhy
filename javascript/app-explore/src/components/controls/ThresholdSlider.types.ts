/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { RecoilState } from 'recoil'

export interface ThresholdSliderProps {
	label?: string
	inlineLabel?: boolean
	width?: number
	thresholdState: RecoilState<number>
}
