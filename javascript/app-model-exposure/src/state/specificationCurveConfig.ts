/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Resetter, SetterOrUpdater } from 'recoil'
import {
	atom,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'

import type { Maybe } from '../types/primitives.js'
import type { SpecificationCurveConfig } from '../types/visualization/SpecificationCurveConfig.js'

export const defaultSpecCurveConfig = {
	medianLine: true,
	meanLine: true,
	shapTicks: false,
	confidenceIntervalTicks: false,
	inactiveFeatures: [],
	inactiveSpecifications: [],
}

export const specificationCurveConfigState = atom<SpecificationCurveConfig>({
	key: 'specification-curve-config-state',
	default: defaultSpecCurveConfig,
})

export function useSpecificationCurveConfig(): SpecificationCurveConfig {
	return useRecoilValue(specificationCurveConfigState)
}

export function useSetSpecificationCurveConfig(): SetterOrUpdater<SpecificationCurveConfig> {
	return useSetRecoilState(specificationCurveConfigState)
}

export function useResetSpecificationCurveConfig(): Resetter {
	return useResetRecoilState(specificationCurveConfigState)
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
