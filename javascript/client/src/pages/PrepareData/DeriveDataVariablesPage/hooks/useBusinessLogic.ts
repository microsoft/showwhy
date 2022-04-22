/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Step, TableContainer } from '@data-wrangling-components/core'
import type { IDetailsColumnProps, IRenderFunction } from '@fluentui/react'
import type {
	CausalFactor,
	Definition,
	FactorsOrDefinitions,
	Handler,
	Handler1,
	Maybe,
} from '@showwhy/types'
import { CausalModelLevel } from '@showwhy/types'
import { useCallback, useMemo } from 'react'

import {
	useAllVariables,
	useAutomaticWorkflowStatus,
	useCausalEffects,
} from '~hooks'
import {
	useCausalFactors,
	useDefinitions,
	useSetDefinitions,
	useSetOutputTablePrep,
	useSetSubjectIdentifier,
	useSetTablesPrepSpecification,
	useSubjectIdentifier,
	useTablesPrepSpecification,
} from '~state'

import {
	useCommandBar,
	useDefinitionDropdownOptions,
	useOnResetVariable,
	useOnSelectVariable,
	useOnSetSubjectIdentifier,
	useRenderDropdown,
} from '../DeriveDataVariablesPage.hooks'

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
	isElementComplete: (element: CausalFactor | Definition) => boolean
	onResetVariable: (columnName: string) => void
	onUpdateOutput: (table: TableContainer<unknown>) => void
	subjectIdentifier: Maybe<string>
	onSetSubjectIdentifier: Handler1<Maybe<string>>
} {
	const prepSpecification = useTablesPrepSpecification()
	const setStepsTablePrep = useSetTablesPrepSpecification()
	const causalFactors = useCausalFactors()
	const definitions = useDefinitions()
	const setDefinitions = useSetDefinitions()
	const allElements = useAllVariables(causalFactors, definitions)
	const setSubjectIdentifier = useSetSubjectIdentifier()
	const subjectIdentifier = useSubjectIdentifier()
	const setOutputTable = useSetOutputTablePrep()
	const causalEffects = useCausalEffects(CausalModelLevel.Maximum)
	const { setDone, setTodo } = useAutomaticWorkflowStatus()

	const allElementsLength = useMemo((): any => {
		return allElements.length + 1
	}, [allElements])

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
				allElementsLength ===
				(hasVariable ? completedElements + 1 : completedElements - 1)
			done ? setDone() : setTodo()
		},
		[allElementsLength, completedElements, setDone, setTodo],
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
		definitions,
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

	const isElementComplete = useCallback(
		(element: CausalFactor | Definition) => {
			const found = allElements?.find(
				(x: CausalFactor | Definition) => x.id === element.id,
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
		onSetSubjectIdentifier,
		subjectIdentifier,
		dropdownOptions,
	)

	const commandBar = useCommandBar(renderDropdown)

	return {
		onChangeSteps,
		steps,
		commandBar,
		elements: allElementsLength, //subjectIdentifier
		completedElements,
		allElements,
		isElementComplete,
		onResetVariable,
		onUpdateOutput,
		subjectIdentifier,
		onSetSubjectIdentifier,
	}
}
