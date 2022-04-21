/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { wait } from '@showwhy/api-client'
import type { AsyncHandler1, Definition } from '@showwhy/types'
import { useCallback } from 'react'

import { useDefinitions, useSetDefinitions } from '~state'
import { withRandomId } from '~utils'

export function useSaveDefinitions(): AsyncHandler1<Definition[]> {
	const definitions = useDefinitions()
	const setDefinitions = useSetDefinitions()
	return useCallback(
		async (definition: Definition | Definition[]) => {
			if (!definition) {
				return
			}
			let list = [...definitions]
			if (!Array.isArray(definition)) {
				list = [...list, withRandomId(definition)]
			} else if (definition.length) {
				list = [...definition]
			}

			setDefinitions(list)
			await wait(500)
		},
		[setDefinitions, definitions],
	)
}
