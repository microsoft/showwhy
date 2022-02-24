/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Step, TableContainer } from '@data-wrangling-components/core'
import { createDefaultCommandBar } from '@data-wrangling-components/react'
import {
	ICommandBarItemProps,
	IDetailsColumnProps,
	IRenderFunction,
	ICommandBarProps,
} from '@fluentui/react'
import { useCallback, useMemo } from 'react'
import { useDefinitionDropdownOptions, useOnResetVariable } from './hooks/index'
import {
	useSubjectIdentifier,
	useProjectFiles,
	useSetSubjectIdentifier,
	useTablesPrepSpecification,
	useSetTablesPrepSpecification,
	useCausalFactors,
	useDefineQuestion,
	useSetDefineQuestion,
} from '~state'
import { useOnSelectVariable } from './hooks/useOnSelectVariable'
import { useRenderDropdown } from './hooks/useRenderDropdownOption'
import { useAllVariables } from './hooks/useAllVariables'

export function useBusinessLogic(): {
	tables: TableContainer[]
	steps?: Step[]
	onChangeSteps: (step: Step[]) => void
	commandBar: IRenderFunction<IDetailsColumnProps>
	elements: number
	completedElements: number
} {
	const projectFiles = useProjectFiles()
	const prepSpecification = useTablesPrepSpecification()
	const setStepsTablePrep = useSetTablesPrepSpecification()
	const causalFactors = useCausalFactors()

	const subjectIdentifier = useSubjectIdentifier()
	const setSubjectIdentifier = useSetSubjectIdentifier()
	const defineQuestion = useDefineQuestion()
	const setDefineQuestion = useSetDefineQuestion()

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

			setSubjectIdentifier(undefined)
		},
		[setStepsTablePrep, setSubjectIdentifier],
	)

	const steps = useMemo((): any => {
		return prepSpecification?.length ? prepSpecification[0].steps : []
	}, [prepSpecification])

	const tables = useMemo((): TableContainer[] => {
		return projectFiles.map(x => {
			return {
				id: x.id,
				name: x.name,
				table: x.table,
			} as TableContainer
		})
	}, [projectFiles])

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
		return allElements.find(x => x)
			? allElements?.filter(x => x.column).length
			: 0
	}, [allElements])

	const renderDropdown = useRenderDropdown(
		allElements,
		onSelectVariable,
		dropdownOptions,
	)

	const commandBar = useCallback(
		(props?: IDetailsColumnProps) => {
			const columnName = props?.column.name ?? ''
			const items: ICommandBarItemProps[] = [
				{
					key: 'definition',
					iconOnly: true,
					onRender: () => renderDropdown(columnName),
				},
				{
					key: 'reset',
					text: 'Reset selection',
					iconOnly: true,
					iconProps: iconProps.reset,
					onClick: () => onResetVariable(columnName),
					disabled: !allElements.find(x => x.column === columnName),
				},
			]
			return createDefaultCommandBar(items, {
				style: { width: 250 },
			} as ICommandBarProps)
		},
		[setSubjectIdentifier, renderDropdown, subjectIdentifier, allElements],
	)

	return {
		tables,
		onChangeSteps,
		steps,
		commandBar,
		elements: allElements.length,
		completedElements,
	}
}

const iconProps = {
	reset: { iconName: 'RemoveLink' },
}
