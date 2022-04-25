/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { FileCollection } from '@data-wrangling-components/utilities'
import type { Resetter, SetterOrUpdater } from 'recoil'
import {
	atom,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'

const fileCollectionState = atom<FileCollection>({
	key: 'file-collection-store',
	default: new FileCollection(),
})

export function useFileCollection(): FileCollection {
	return useRecoilValue(fileCollectionState)
}

export function useSetFileCollection(): SetterOrUpdater<FileCollection> {
	return useSetRecoilState(fileCollectionState)
}

export function useResetFileCollection(): Resetter {
	return useResetRecoilState(fileCollectionState)
}
