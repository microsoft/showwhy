/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Maybe, SpecificationCurveConfig } from '@showwhy/types'
import type { Resetter, SetterOrUpdater } from 'recoil'
import {
	atom,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'

export const defaultConfig = {
	medianLine: true,
	meanLine: true,
	shapTicks: false,
	confidenceIntervalTicks: false,
	inactiveFeatures: [],
	inactiveSpecifications: [],
}

export const specificationCurveConfig = atom<SpecificationCurveConfig>({
	key: 'specification-curve-config-state',
	default: defaultConfig,
})

export function useSpecificationCurveConfig(): SpecificationCurveConfig {
	return useRecoilValue(specificationCurveConfig)
}

export function useSetSpecificationCurveConfig(): SetterOrUpdater<SpecificationCurveConfig> {
	return useSetRecoilState(specificationCurveConfig)
}

export function useResetSpecificationCurveConfig(): Resetter {
	return useResetRecoilState(specificationCurveConfig)
}

export const hoverState = atom<Maybe<string>>({
	key: 'specification-curve-hover-state',
	default: undefined,
})

export function useHoverState(): Maybe<string> {
	return useRecoilValue(hoverState)
}

export function useSetHoverState(): SetterOrUpdater<Maybe<string>> {
	return useSetRecoilState(hoverState)
}

export function useResetHoverState(): Resetter {
	return useResetRecoilState(hoverState)
}
