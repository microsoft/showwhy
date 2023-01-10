/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Resetter, SetterOrUpdater } from 'recoil'
import {
	atom,
	useRecoilState,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'

export const PlaceboSimulationState = atom<boolean>({
	key: 'PlaceboSimulationState',
	default: false,
})

export function usePlaceboSimulationValueState(): boolean {
	return useRecoilValue(PlaceboSimulationState)
}

export function useSetPlaceboSimulationState(): SetterOrUpdater<boolean> {
	return useSetRecoilState(PlaceboSimulationState)
}

export function usePlaceboSimulationState(): [
	boolean,
	SetterOrUpdater<boolean>,
] {
	return useRecoilState(PlaceboSimulationState)
}

export function usePlaceboSimulationResetState(): Resetter {
	return useResetRecoilState(PlaceboSimulationState)
}
