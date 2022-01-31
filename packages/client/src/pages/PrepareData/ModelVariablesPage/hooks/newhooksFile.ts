/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	ICommandBarItemProps,
	IContextualMenuItem,
	IDetailsColumnProps,
	IDropdownOption,
	IRenderFunction,
} from '@fluentui/react'
import { useBoolean } from 'ahooks'
import { useCallback, useMemo, useState } from 'react'
import { useDefinitionOptions } from './variables'
import {
	useAddOrEditFactor,
	useDeriveTable1,
	usePageType,
	useSaveDefinition,
} from '~hooks'
import {
	useCausalFactors,
	useDefineQuestion,
	useExposureVariables,
	useOriginalTables,
	useSetOrUpdateExposureVariables,
	useTableColumns,
	usePopulationVariables,
	useSetOrUpdatePopulationVariables,
	useOutcomeVariables,
	useSetOrUpdateOutcomeVariables,
} from '~state'
import {
	CausalFactor,
	ColumnRelevance,
	Element,
	PageType,
	VariableDefinition1,
} from '~types'
import { createDefaultCommandBar } from '@data-wrangling-components/react'
import ColumnTable from 'arquero/dist/types/table/column-table'
import * as aq from 'arquero'
import { not } from 'arquero'
import { runPipeline, Step } from '@data-wrangling-components/core'

export function useBusinessLogic1(): {
	commandBar: IRenderFunction<IDetailsColumnProps>
	defineQuestionData: Element
	definitionDropdown: IDropdownOption[]
	selectedDefinition: string
	selectDefinition: (definition: string) => void
} {
	const [selectedDefinition, setSelectedDefinition] = useState<string>('')
	const pageType = usePageType()

	const defineQuestion = useDefineQuestion()
	const defineQuestionData = defineQuestion[pageType] as Element
	const saveCausalFactor = useAddOrEditFactor()
	const saveDefinition = useSaveDefinition()
	const causalFactors = useCausalFactors()
	const setTargetOnCausalFactor = useTargetOnCausalFactor(
		selectedDefinition,
		causalFactors,
		saveCausalFactor,
	)
	const setTargetVariable = useSetTargetVariable(
		selectedDefinition,
		saveDefinition,
		pageType,
		defineQuestionData,
		setTargetOnCausalFactor, //?????
	)

	const selectDefinition = useCallback(
		(val: any) => {
			setSelectedDefinition(val)
		},
		[setSelectedDefinition],
	)

	const definitionOptions = useDefinitionOptions({
		defineQuestionData,
		type: pageType,
		causalFactors,
	})

	const commandBar = useCallback(
		(props?: IDetailsColumnProps) => {
			//TODO: why the type as here
			const selectedColumn = (definitionOptions as CausalFactor[]).find(
				x => x.variable === selectedDefinition,
			)?.column
			const actualColumn = props?.column.name as string
			const items: ICommandBarItemProps[] = [
				{
					key: 'assignItem',
					text: 'Assign',
					iconOnly: true,
					onClick: () => setTargetVariable(actualColumn),
					checked: selectedColumn === actualColumn,
					iconProps: {
						//TODO: change icon props to new style on Chris's pR
						iconName: 'CheckMark',
					},
				},
				{
					key: 'newItem',
					text: 'Hide column',
					disabled: selectedColumn === actualColumn,
					iconOnly: true,
					iconProps: { iconName: 'Hide3' },
				},
				{
					key: 'duplicateItem',
					text: 'Duplicate',
					iconOnly: true,
					iconProps: { iconName: 'DuplicateRow' },
				},
			]
			return createDefaultCommandBar(items)
		},
		[definitionOptions, selectedDefinition],
	)

	const definitionDropdown = useMemo((): IDropdownOption[] => {
		return definitionOptions.map(x => {
			return {
				key: x.variable,
				text: x.variable,
			} as IDropdownOption
		})
	}, [definitionOptions])

	return {
		commandBar,
		defineQuestionData,
		definitionDropdown,
		selectedDefinition,
		selectDefinition,
	}
}

export function tableTransform(): {
	commands: ICommandBarItemProps[]
	isModalOpen: boolean
	hideModal: () => void
	originalTable?: ColumnTable
	handleTransformRequested: (
		step: any,
		selectedDefinition: string,
	) => Promise<void>
	variables: VariableDefinition1[]
} {
	const pageType = usePageType()
	const [variables, set] = useStateA(pageType)
	console.log(pageType)
	console.log(variables)
	const originalTables = useOriginalTables()
	const tableColumns = useTableColumns(originalTables[0]?.tableId)
	const derive = useDeriveTable1(originalTables[0]?.tableId)
	const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] =
		useBoolean(false)
	const commands = useCommands(showModal)

	const removedColumns = useMemo((): string[] => {
		return (
			tableColumns
				?.filter(x => x.relevance === ColumnRelevance.NotRelevant)
				.map(x => x.name) || []
		)
	}, [tableColumns])

	const originalTable = useMemo((): ColumnTable | undefined => {
		return originalTables.length
			? originalTables[0].table.select(not(removedColumns))
			: undefined
	}, [originalTables])

	const handleTransformRequested = useCallback(
		async (step: Step, selectedDefinition: string) => {
			if (originalTable && step) {
				debugger
				const output = await runPipeline(originalTable, [step])
				derive(output)
				//how would I know the type T
				//it's not all of them that have to
				//store the steps
				set({
					steps: [...variables.flatMap(x => x.steps), step],
					name: selectedDefinition,
				})
			}
		},
		[originalTable, derive, variables],
	)

	return {
		commands,
		isModalOpen,
		hideModal,
		originalTable,
		handleTransformRequested,
		variables,
	}
}

function useCommands(showModal: any) {
	const dccmd = useDeriveColumnCommand(showModal)
	return useMemo(() => [dccmd], [dccmd])
}

function useDeriveColumnCommand(
	onClick: (
		ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
		item?: IContextualMenuItem,
	) => boolean | void,
) {
	const cmd = useMemo(() => {
		return {
			key: 'derive-column',
			text: 'Create column',
			iconProps: {
				iconName: 'Add',
			},
			onClick,
		}
	}, [onClick])
	return cmd
}

function useSetTargetVariable(
	selected: string,
	saveDefinition: (definition: CausalFactor) => void,
	type: PageType,
	defineQuestionData: Element,
	setTargetOnCausalFactor: (val: any) => void,
) {
	return useCallback(
		(value: string) => {
			debugger
			if (type === PageType.Control) {
				return setTargetOnCausalFactor(value)
			}
			const newDefinition = {
				...defineQuestionData?.definition.find(x => x.variable === selected),
			} as CausalFactor

			if (newDefinition) {
				newDefinition.column = value
			}

			saveDefinition(newDefinition)
		},
		[
			selected,
			saveDefinition,
			type,
			defineQuestionData?.definition,
			setTargetOnCausalFactor,
		],
	)
}

function useTargetOnCausalFactor(selected, causalFactors, saveCausalFactor) {
	return useCallback(
		(val: any) => {
			const selectedCausal = {
				...causalFactors.find(x => x.variable === selected),
			} as CausalFactor

			if (selectedCausal) {
				selectedCausal.column = val.text
			}

			saveCausalFactor(selectedCausal)
		},
		[selected, causalFactors, saveCausalFactor],
	)
}

export function useTable(
	selectedDefinition: string,
	variables: VariableDefinition1[],
	originalTable?: ColumnTable,
) {
	return useMemo((): any => {
		//this works while we're doing commands with to arg
		if (!originalTable || !variables) {
			return aq.table({})
		}

		const steps =
			variables
				.find(a => a.name === selectedDefinition)
				?.steps.flatMap(s => s.args.to) || []
		return originalTable?.select(steps)
	}, [originalTable, variables, selectedDefinition])
}

function useStateA(pageType: PageType) {
	const population = usePopulationVariables()
	const exposure = useExposureVariables()
	const outcome = useOutcomeVariables()
	let setPopulation = useSetOrUpdatePopulationVariables()
	let setExposure = useSetOrUpdateExposureVariables()
	let setOutcome = useSetOrUpdateOutcomeVariables()

	return useMemo(() => {
		switch (pageType) {
			case PageType.Population:
				return [population, setPopulation]
			case PageType.Exposure:
				return [exposure, setExposure]
			case PageType.Outcome:
				return [outcome, setOutcome]
		}
	}, [
		pageType,
		population,
		exposure,
		outcome,
		setPopulation,
		setExposure,
		setOutcome,
	])
}
