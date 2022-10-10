/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useMemo } from 'react'

import { useCausalFactors } from '../../state/causalFactors.js'
import { useDefinitions, useSetDefinitions } from '../../state/definitions.js'
import {
	useSetSubjectIdentifier,
	useSubjectIdentifier,
} from '../../state/subjectIdentifier.js'
import type { CausalFactor } from '../../types/causality/CausalFactor.js'
import type { Definition } from '../../types/experiments/Definition.js'
import type { Handler1, Maybe } from '../../types/primitives.js'
import { useAllVariables } from '../useAllVariables.js'
import { useDefinitionDropdownOptions } from './useDefinitionDropdownOptions.js'
import { useOnAssignAllSubjects } from './useOnAssignAllSubjects.js'
import { useOnResetVariable } from './useOnResetVariable.js'
import { useOnSelectVariable } from './useOnSelectVariable.js'
import { useOnSetSubjectIdentifier } from './useOnSetSubjectIdentifier.js'

export function useGetElements(): {
	completedElements: number
	allElements: CausalFactor[] | Definition[]
	onResetVariable: (columnName: string) => void
	subjectIdentifier: Maybe<string>
	onSetSubjectIdentifier: Handler1<Maybe<string>>
	onAssignAllSubjects: (definitionId: string) => void
} {
	const causalFactors = useCausalFactors()
	const definitions = useDefinitions()
	const setDefinitions = useSetDefinitions()
	const allElements = useAllVariables(causalFactors, definitions)
	const setSubjectIdentifier = useSetSubjectIdentifier()
	const subjectIdentifier = useSubjectIdentifier()

	const completedElements = useMemo((): number => {
		const initial = subjectIdentifier ? 1 : 0
		return allElements.find((x: CausalFactor | Definition) => x)
			? allElements?.filter((x: CausalFactor | Definition) => x.column).length +
					initial
			: initial
	}, [allElements, subjectIdentifier])

	const onSetSubjectIdentifier = useOnSetSubjectIdentifier(
		subjectIdentifier,
		setSubjectIdentifier,
	)

	const onSelectVariable = useOnSelectVariable(
		causalFactors,
		definitions,
		subjectIdentifier,
		setDefinitions,
		setSubjectIdentifier,
	)

	const onAssignAllSubjects = useOnAssignAllSubjects(onSelectVariable)

	const dropdownOptions = useDefinitionDropdownOptions(
		definitions,
		causalFactors,
	)
	const onResetVariable = useOnResetVariable(
		allElements,
		dropdownOptions,
		onSelectVariable,
	)

	return {
		completedElements,
		allElements,
		onResetVariable,
		subjectIdentifier,
		onSetSubjectIdentifier,
		onAssignAllSubjects,
	}
}
