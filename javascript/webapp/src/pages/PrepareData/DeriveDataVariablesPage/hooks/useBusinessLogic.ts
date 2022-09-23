/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IDetailsColumnProps, IRenderFunction } from '@fluentui/react'
import type { FactorsOrDefinitions, Handler1, Maybe } from '@showwhy/types'

import { useAllVariables } from '~hooks'
import { useSetSubjectIdentifier, useSubjectIdentifier } from '~state'

import {
	useCommandBar,
	useDefinitionDropdownOptions,
	useOnResetVariable,
	useOnSelectVariable,
	useOnSetSubjectIdentifier,
	useRenderDropdown,
} from '../DeriveDataVariablesPage.hooks'
import { useCompletedElements } from './useCompletedElements'
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
	const allElements = useAllVariables()
	const setSubjectIdentifier = useSetSubjectIdentifier()
	const subjectIdentifier = useSubjectIdentifier()
	const completedElements = useCompletedElements()

	const onSetSubjectIdentifier = useOnSetSubjectIdentifier(
		subjectIdentifier,
		setSubjectIdentifier,
	)

	const onSelectVariable = useOnSelectVariable()
	const onAssignAllSubjects = useOnAssignAllSubjects(onSelectVariable)
	const dropdownOptions = useDefinitionDropdownOptions()
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
