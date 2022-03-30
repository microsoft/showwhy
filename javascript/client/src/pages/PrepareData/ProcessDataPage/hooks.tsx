/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Step, TableContainer } from '@data-wrangling-components/core'
import type { IDetailsColumnProps, IRenderFunction } from '@fluentui/react'
import type {
	CausalFactor,
	ElementDefinition,
	FactorsOrDefinitions,
	Handler,
	Handler1,
} from '@showwhy/types'
import { CausalModelLevel } from '@showwhy/types'
import { useCallback, useMemo } from 'react'

import { useAllVariables, useCausalEffects } from '~hooks'
import {
	useCausalFactors,
	useSetOutputTablePrep,
	useSetSubjectIdentifier,
	useSetTablesPrepSpecification,
	useSubjectIdentifier,
	useTablesPrepSpecification,
} from '~state'
import { useExperiment, useSetExperiment } from '~state/experiment'

import {
	useCommandBar,
	useDefinitionDropdownOptions,
	useOnResetVariable,
} from './hooks/index'
import { useOnSelectVariable } from './hooks/useOnSelectVariable'
import { useRenderDropdown } from './hooks/useRenderDropdownOption'

export function useBusinessLogic(
	toggleShowCallout: Handler,
	setSelectedColumn: Handler1<string>,
): {
	steps?: Step[]
	onChangeSteps: (step: Step[]) => void
	commandBar: IRenderFunction<IDetailsColumnProps>
	elements: number
	completedElements: number
	allElements: FactorsOrDefinitions
	isElementComplete: (element: CausalFactor | ElementDefinition) => boolean
	onResetVariable: (columnName: string) => void
	onUpdateOutput: (table: TableContainer<unknown>) => void
} {
	const prepSpecification = useTablesPrepSpecification()
	const setStepsTablePrep = useSetTablesPrepSpecification()
	const causalFactors = useCausalFactors()
	const defineQuestion = useExperiment()
	const setDefineQuestion = useSetExperiment()
	const allElements = useAllVariables(causalFactors, defineQuestion)
	const setSubjectIdentifier = useSetSubjectIdentifier()
	const subjectIdentifier = useSubjectIdentifier()
	const setOutputTable = useSetOutputTablePrep()

	const causalEffects = useCausalEffects(CausalModelLevel.Maximum)
	const onSelectVariable = useOnSelectVariable(
		causalFactors,
		defineQuestion,
		subjectIdentifier,
		setDefineQuestion,
		setSubjectIdentifier,
	)

	const onUpdateOutput = useCallback(
		(table: TableContainer) => {
			setOutputTable(table.table)
		},
		[setOutputTable],
	)

	const onAddVariable = useCallback(
		(columnName: string) => {
			setSelectedColumn(columnName)
			toggleShowCallout()
		},
		[toggleShowCallout, setSelectedColumn],
	)

	const dropdownOptions = useDefinitionDropdownOptions(
		defineQuestion,
		causalFactors,
		causalEffects,
	)
	const onResetVariable = useOnResetVariable(
		allElements,
		dropdownOptions,
		onSelectVariable,
	)

	const onChangeSteps = useCallback(
		(steps: Step[]) => {
			setStepsTablePrep(prev => {
				const _prev = [...(prev ?? [])]
				_prev[0] = { ..._prev[0], steps }
				return _prev
			})
		},
		[setStepsTablePrep],
	)

	const steps = useMemo((): any => {
		return prepSpecification !== undefined ? prepSpecification[0]?.steps : []
	}, [prepSpecification])

	const completedElements = useMemo((): number => {
		return allElements.find((x: CausalFactor | ElementDefinition) => x)
			? allElements?.filter((x: CausalFactor | ElementDefinition) => x.column)
					.length
			: 0
	}, [allElements])

	const isElementComplete = useCallback(
		(element: CausalFactor | ElementDefinition) => {
			const found = allElements?.find(
				(x: CausalFactor | ElementDefinition) => x.id === element.id,
			)
			return !!found?.column
		},
		[allElements],
	)

	const renderDropdown = useRenderDropdown(
		allElements,
		onSelectVariable,
		onResetVariable,
		onAddVariable,
		setSubjectIdentifier,
		subjectIdentifier,
		dropdownOptions,
	)

	const commandBar = useCommandBar(renderDropdown)

	return {
		onChangeSteps,
		steps,
		commandBar,
		elements: allElements.length,
		completedElements,
		allElements,
		isElementComplete,
		onResetVariable,
		onUpdateOutput,
	}
}
