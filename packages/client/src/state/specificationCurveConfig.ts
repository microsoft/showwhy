/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	atom,
	Resetter,
	SetterOrUpdater,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'
import type { SpecificationCurveConfig, Maybe } from '~types'

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

export const hoverState = atom<Maybe<number>>({
	key: 'specification-curve-hover-state',
	default: undefined,
})

export function useHoverState(): Maybe<number> {
	return useRecoilValue(hoverState)
}

export function useSetHoverState(): SetterOrUpdater<Maybe<number>> {
	return useSetRecoilState(hoverState)
}

export function useResetHoverState(): Resetter {
	return useResetRecoilState(hoverState)
}
