/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Resetter, SetterOrUpdater } from 'recoil'
import { atom, useRecoilState, useResetRecoilState } from 'recoil'

import { PageTabs } from '../types/workspace/PageTabs.js'

export const PageTabState = atom<PageTabs>({
	key: 'PageTabState',
	default: PageTabs.DefineQuestion,
})

export function usePageTab(): [PageTabs, SetterOrUpdater<PageTabs>] {
	return useRecoilState(PageTabState)
}

export function useResetPageTab(): Resetter {
	return useResetRecoilState(PageTabState)
}
