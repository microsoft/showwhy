/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useState, useCallback } from 'react'
import {
	ElementDefinition,
	CausalFactor,
	RenameCalloutArgs,
	RenameCalloutType,
} from '~types'

export function useRenameCallout(
	definition?: ElementDefinition | CausalFactor,
): RenameCalloutArgs {
	const [calloutOpen, setCalloutOpen] = useState<
		RenameCalloutType | undefined
	>()
	const [definitionName, setDefinitionName] = useState<string>('')

	const toggleCallout = useCallback(
		(type?: RenameCalloutType) => {
			setCalloutOpen(type)
			let name = definition?.variable ?? ''
			switch (type) {
				case RenameCalloutType.New:
					name = 'New definition'
					break
				case RenameCalloutType.Duplicate:
					name += ' new'
					break
			}
			setDefinitionName(name)
		},
		[setCalloutOpen, setDefinitionName, definition],
	)

	return {
		calloutOpen,
		toggleCallout,
		definitionName,
	}
}
