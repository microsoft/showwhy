/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IContextualMenuItem } from '@fluentui/react'
import { useCallback } from 'react'

import { OUTPUT_FILE_NAME } from '../../pages/AnalyzeTestPage.constants.js'
import type { Maybe } from '../../types/primitives.js'

export function useOnAssignAllSubjects(
	onSelectVariable: (
		option: Maybe<IContextualMenuItem>,
		columnName: string,
	) => void,
): (definitionId: string) => void {
	return useCallback(
		(definitionId: string) => {
			const option = { key: definitionId } as IContextualMenuItem
			onSelectVariable(option, OUTPUT_FILE_NAME)
		},
		[onSelectVariable],
	)
}
