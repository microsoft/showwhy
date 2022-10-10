/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IChoiceGroupOption } from '@fluentui/react'
import type { FormEvent } from 'react'
import { useCallback } from 'react'

import { useSetConfounderThreshold } from '../state/confounderThreshold.js'

export function useOnConfounderThresholdChange(): (
	_?: FormEvent<HTMLElement | HTMLInputElement> | undefined,
	option?: IChoiceGroupOption | undefined,
) => void {
	const setConfounderThreshold = useSetConfounderThreshold()

	return useCallback(
		(
			_?: FormEvent<HTMLElement | HTMLInputElement> | undefined,
			option?: IChoiceGroupOption | undefined,
		) => {
			if (option) setConfounderThreshold(+option?.key)
		},
		[setConfounderThreshold],
	)
}
