/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Step } from '@data-wrangling-components/core'
import type { IDetailsColumnProps, IRenderFunction } from '@fluentui/react'
import type { CausalFactor, ElementDefinition } from '@showwhy/types'
import { useCallback, useMemo } from 'react'

import { useAllVariables } from '~hooks'
import {
	useCausalFactors,
	useSetTablesPrepSpecification,
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

export function useBusinessLogic(): {
	steps?: Step[]
	onChangeSteps: (step: Step[]) => void
	commandBar: IRenderFunction<IDetailsColumnProps>
	elements: number
	completedElements: number
} {
	const prepSpecification = useTablesPrepSpecification()
	const setStepsTablePrep = useSetTablesPrepSpecification()
	const causalFactors = useCausalFactors()
	const defineQuestion = useExperiment()
	const setDefineQuestion = useSetExperiment()

	const dropdownOptions = useDefinitionDropdownOptions(
		defineQuestion,
		causalFactors,
	)

	const onChangeSteps = useCallback(
		(steps: Step[]) => {
			setStepsTablePrep(prev => {
				const _prev = [...prev]
				_prev[0] = { ..._prev[0], steps }
				return _prev
			})
		},
		[setStepsTablePrep],
	)

	const steps = useMemo((): any => {
		return prepSpecification !== undefined ? prepSpecification[0]?.steps : []
	}, [prepSpecification])

	const onSelectVariable = useOnSelectVariable(
		causalFactors,
		defineQuestion,
		setDefineQuestion,
	)

	const allElements = useAllVariables(causalFactors, defineQuestion)

	const onResetVariable = useOnResetVariable(
		allElements,
		dropdownOptions,
		onSelectVariable,
	)

	const completedElements = useMemo((): number => {
		return allElements.find((x: CausalFactor | ElementDefinition) => x)
			? allElements?.filter((x: CausalFactor | ElementDefinition) => x.column)
					.length
			: 0
	}, [allElements])

	const renderDropdown = useRenderDropdown(
		allElements,
		onSelectVariable,
		dropdownOptions,
	)

	const commandBar = useCommandBar(renderDropdown, onResetVariable, allElements)

	return {
		onChangeSteps,
		steps,
		commandBar,
		elements: allElements.length,
		completedElements,
	}
}
