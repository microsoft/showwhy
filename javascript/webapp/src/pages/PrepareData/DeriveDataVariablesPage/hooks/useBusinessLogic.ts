/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IDetailsColumnProps, IRenderFunction } from '@fluentui/react'
import type {
	CausalFactor,
	Definition,
	FactorsOrDefinitions,
	Handler1,
	Maybe,
} from '@showwhy/types'
import { useCallback, useMemo } from 'react'

import { useAllVariables, useAutomaticWorkflowStatus } from '~hooks'
import {
	useCausalFactors,
	useDefinitions,
	useSetDefinitions,
	useSetSubjectIdentifier,
	useSubjectIdentifier,
} from '~state'

import {
	useCommandBar,
	useDefinitionDropdownOptions,
	useOnResetVariable,
	useOnSelectVariable,
	useOnSetSubjectIdentifier,
	useRenderDropdown,
} from '../DeriveDataVariablesPage.hooks'
import { useOnAssignAllSubjects } from './useOnAssignAllSubjects'

export function useBusinessLogic(): {
	commandBar: IRenderFunction<IDetailsColumnProps>
	completedElements: number
	allElements: FactorsOrDefinitions
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
	const { setDone, setTodo } = useAutomaticWorkflowStatus()

	const completedElements = useMemo((): number => {
		const initial = !!subjectIdentifier ? 1 : 0
		return allElements.find((x: CausalFactor | Definition) => x)
			? allElements?.filter((x: CausalFactor | Definition) => x.column).length +
					initial
			: initial
	}, [allElements, subjectIdentifier])

	const isStepDone = useCallback(
		(hasVariable: boolean) => {
			const done =
				allElements.length + 1 ===
				(hasVariable ? completedElements + 1 : completedElements - 1)
			done ? setDone() : setTodo()
		},
		[allElements, completedElements, setDone, setTodo],
	)

	const onSetSubjectIdentifier = useOnSetSubjectIdentifier(
		subjectIdentifier,
		setSubjectIdentifier,
		isStepDone,
	)

	const onSelectVariable = useOnSelectVariable(
		causalFactors,
		definitions,
		subjectIdentifier,
		setDefinitions,
		setSubjectIdentifier,
		isStepDone,
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

	const renderDropdown = useRenderDropdown(
		allElements,
		onSelectVariable,
		onResetVariable,
		onSetSubjectIdentifier,
		subjectIdentifier,
		dropdownOptions,
	)

	const commandBar = useCommandBar(renderDropdown)

	return {
		commandBar,
		completedElements,
		allElements,
		onResetVariable,
		subjectIdentifier,
		onSetSubjectIdentifier,
		onAssignAllSubjects,
	}
}
