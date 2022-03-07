/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { FileCollection } from '@data-wrangling-components/utilities'
import {
	atom,
	Resetter,
	SetterOrUpdater,
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
