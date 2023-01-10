/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { SetterOrUpdater } from 'recoil'
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import type { ChartOptions } from '../types.js'

export const DEFAULT_CHART_OPTIONS: ChartOptions = {
	renderRawData: true,
	showTreatmentStart: true,
	showSynthControl: false,
	applyIntercept: false,
	relativeIntercept: false,
	showGrid: true,
	showMeanTreatmentEffect: false,
	showChartPerUnit: false,
}

export const ChartOptionsState = atom<ChartOptions>({
	key: 'ChartOptionsState',
	default: DEFAULT_CHART_OPTIONS,
})

export function useChartOptionsValueState(): ChartOptions {
	return useRecoilValue(ChartOptionsState)
}

export function useSetChartOptionsState(): SetterOrUpdater<ChartOptions> {
	return useSetRecoilState(ChartOptionsState)
}

export function useChartOptionsState(): [
	ChartOptions,
	SetterOrUpdater<ChartOptions>,
] {
	return useRecoilState(ChartOptionsState)
}
