/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { SetterOrUpdater } from 'recoil'
import { atom, useRecoilValue, useSetRecoilState } from 'recoil'

import type { ToggleCallback } from '~hooks'
import { useRecoilBasedToggle } from '~hooks'

const calloutState = atom<boolean>({
	key: 'toggle-callout-store',
	default: false,
})

export function useCallout(): [boolean, ToggleCallback] {
	return useRecoilBasedToggle(calloutState)
}

const selectedColumnState = atom<string>({
	key: 'selected-column-store',
	default: '',
})

export function useSelectedColumnState(): string {
	return useRecoilValue(selectedColumnState)
}

export function useSetSelectedColumnState(): SetterOrUpdater<string> {
	return useSetRecoilState(selectedColumnState)
}

export function useSelectedColumn(): [string, SetterOrUpdater<string>] {
	return [useSelectedColumnState(), useSetSelectedColumnState()]
}
