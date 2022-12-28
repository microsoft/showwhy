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

import type { MessageBarProps } from '../types.js'

export const UserMessageState = atom<MessageBarProps>({
	key: 'UserMessageState',
	default: {
		isVisible: false,
		content: '',
	},
})

export function useUserMessageValueState(): MessageBarProps {
	return useRecoilValue(UserMessageState)
}

export function useSetUserMessageState(): SetterOrUpdater<MessageBarProps> {
	return useSetRecoilState(UserMessageState)
}

export function useUserMessageState(): [
	MessageBarProps,
	SetterOrUpdater<MessageBarProps>,
] {
	return useRecoilState(UserMessageState)
}

export function useUserMessageResetState(): Resetter {
	return useResetRecoilState(UserMessageState)
}
