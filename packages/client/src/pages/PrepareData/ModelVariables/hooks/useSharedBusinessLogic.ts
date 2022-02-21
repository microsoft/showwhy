/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useBoolean } from '@fluentui/react-hooks'
import { useOutputTablePrep, useSubjectIdentifier } from '~state'
import { SharedModelVariableLogic } from '~types'

export function useSharedBusinessLogic(): SharedModelVariableLogic {
	const [showConfirmDelete, { toggle: toggleShowConfirmDelete }] =
		useBoolean(false)
	const outputTablePrep = useOutputTablePrep()
	const subjectIdentifier = useSubjectIdentifier()

	return {
		showConfirmDelete,
		toggleShowConfirmDelete,
		outputTablePrep,
		subjectIdentifier,
	}
}
