/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { atom, useRecoilValue, useSetRecoilState } from 'recoil'
import { recoilPersist } from 'recoil-persist'

import { GraphViewStates } from '../components/graph/GraphViews.types.js'
import { CausalDiscoveryAlgorithm } from '../domain/CausalDiscovery/CausalDiscoveryAlgorithm.js'
import type { Selectable } from '../domain/Selection.js'
import { persistAtomEffect } from '../state/PersistentInfoState.js'

const { persistAtom } = recoilPersist()

export const LoadingState = atom<string | undefined>({
	key: 'LoadingState',
	default: undefined,
})

export const StraightEdgesState = atom<boolean>({
	key: 'StraightEdgesState',
	default: false,
	// eslint-disable-next-line camelcase
	effects_UNSTABLE: [persistAtomEffect, persistAtom],
})

export const AutoLayoutEnabledState = atom<boolean>({
	key: 'AutoLayoutEnabledState',
	default: true,
	// eslint-disable-next-line camelcase
	effects_UNSTABLE: [persistAtomEffect, persistAtom],
})

export const ShowChangesInGraphState = atom<boolean>({
	key: 'ShowChangesInGraphState',
	default: false,
	// eslint-disable-next-line camelcase
	effects_UNSTABLE: [persistAtomEffect, persistAtom],
})

export const SelectedCausalDiscoveryAlgorithmState =
	atom<CausalDiscoveryAlgorithm>({
		key: 'SelectedCausalDiscoveryAlgorithmState',
		default: CausalDiscoveryAlgorithm.NOTEARS,
	})

export const SelectedObjectState = atom<Selectable>({
	key: 'SelectedObjectState',
	default: undefined,
	effects: [persistAtomEffect],
})

export const WeightThresholdState = atom<number>({
	key: 'WeightThresholdState',
	default: 0.005,
	// eslint-disable-next-line camelcase
	effects_UNSTABLE: [persistAtomEffect, persistAtom],
})

export const ConfidenceThresholdState = atom<number>({
	key: 'ConfidenceThresholdState',
	default: 0.0,
	// eslint-disable-next-line camelcase
	effects_UNSTABLE: [persistAtomEffect, persistAtom],
})

export const CorrelationThresholdState = atom<number>({
	key: 'CorrelationThresholdState',
	default: 0.2,
	// eslint-disable-next-line camelcase
	effects_UNSTABLE: [persistAtomEffect, persistAtom],
})

export const GraphViewState = atom<GraphViewStates>({
	key: 'GraphViewState',
	default: GraphViewStates.CausalView,
})

export const PauseAutoRunState = atom<
	CausalDiscoveryAlgorithm.None | undefined
>({
	key: 'PauseAutoRunState',
	default: undefined,
})

export function useLoading(): string | undefined {
	return useRecoilValue(LoadingState)
}

export function useCausalDiscoveryAlgorithm(): CausalDiscoveryAlgorithm {
	return useRecoilValue(SelectedCausalDiscoveryAlgorithmState)
}

export function useSetCausalDiscoveryAlgorithm(): (
	value: CausalDiscoveryAlgorithm,
) => void {
	return useSetRecoilState(SelectedCausalDiscoveryAlgorithmState)
}

export function useAutoLayoutEnabled(): boolean {
	return useRecoilValue(AutoLayoutEnabledState)
}

export function useSetAutoLayoutEnabled(): (value: boolean) => void {
	return useSetRecoilState(AutoLayoutEnabledState)
}

export function usePauseAutoRun(): CausalDiscoveryAlgorithm.None | undefined {
	return useRecoilValue(PauseAutoRunState)
}

export function useSetPauseAutoRun(): (
	value: CausalDiscoveryAlgorithm.None | undefined,
) => void {
	return useSetRecoilState(PauseAutoRunState)
}

export function useGraphViewState(): GraphViewStates {
	return useRecoilValue(GraphViewState)
}

export function useSetGraphViewState(): (value: GraphViewStates) => void {
	return useSetRecoilState(GraphViewState)
}

export function useStraightEdges(): boolean {
	return useRecoilValue(StraightEdgesState)
}

export function useSetStraightEdges(): (value: boolean) => void {
	return useSetRecoilState(StraightEdgesState)
}

export function useShowChangesInGraph(): boolean {
	return useRecoilValue(ShowChangesInGraphState)
}

export function useSetShowChangesInGraph(): (value: boolean) => void {
	return useSetRecoilState(ShowChangesInGraphState)
}

export function useCorrelationThreshold(): number {
	return useRecoilValue(CorrelationThresholdState)
}

export function useSetCorrelationThreshold(): (value: number) => void {
	return useSetRecoilState(CorrelationThresholdState)
}

export function useWeightThreshold(): number {
	return useRecoilValue(WeightThresholdState)
}

export function useSetWeightThreshold(): (value: number) => void {
	return useSetRecoilState(WeightThresholdState)
}

export function useSelectedObject(): Selectable {
	return useRecoilValue(SelectedObjectState)
}

export function useSetSelectedObject(): (value: Selectable) => void {
	return useSetRecoilState(SelectedObjectState)
}

export function useConfidenceThreshold(): number {
	return useRecoilValue(ConfidenceThresholdState)
}