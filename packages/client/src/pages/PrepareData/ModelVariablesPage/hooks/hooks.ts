/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { runPipeline, Step } from '@data-wrangling-components/core'
import { createDefaultCommandBar } from '@data-wrangling-components/react'
import {
	ICommandBarItemProps,
	IContextualMenuItem,
	IDetailsColumnProps,
	IDropdownOption,
	IRenderFunction,
} from '@fluentui/react'
import { useBoolean } from 'ahooks'
import * as aq from 'arquero'
import { not } from 'arquero'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { SelectedArgs } from './interfaces'
import { FactorsOrDefinitions } from './types'
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
	CausalityLevel,
	ColumnRelevance,
	Element,
	ElementDefinition,
	Experiment,
	PageType,
	VariableDefinition1,
} from '~types'
import { v4 } from 'uuid'

export function useBusinessLogic(): {
	pageType: PageType
	defineQuestion: Experiment
	defineQuestionData: Element
	causalFactors: CausalFactor[]
	definitionOptions: FactorsOrDefinitions
} {
	const pageType = usePageType()
	const defineQuestion = useDefineQuestion()
	const defineQuestionData = defineQuestion[pageType] as Element
	const causalFactors = useCausalFactors()
	const definitionOptions = useDefinitionOptions({
		defineQuestionData,
		pageType,
		causalFactors,
	})

	return {
		pageType,
		defineQuestion,
		defineQuestionData,
		causalFactors,
		definitionOptions,
	}
}

function useSelectedDefinition(
	definitionId: string,
	defineQuestionData: Element,
): ElementDefinition | undefined {
	return useMemo(() => {
		return defineQuestionData?.definition.find(x => x.id === definitionId)
	}, [defineQuestionData, definitionId])
}

export function useDefinitionDropdown(
	definitionOptions: FactorsOrDefinitions,
): IDropdownOption[] {
	return useMemo((): IDropdownOption[] => {
		return definitionOptions.map(x => {
			return {
				key: x.id,
				text: x.variable,
			} as IDropdownOption
		})
	}, [definitionOptions])
}

export function useDefinitions(defineQuestionData: Element): {
	selectedDefinitionId: string
	setSelectedDefinitionId: (definitionId: string) => void
	isEditingDefinition: boolean
	isAddingDefinition: boolean
	toggleEditDefinition: () => void
	toggleAddDefinition: () => void
	onChange: (_: unknown, value?: string) => void
	definitionName: string
	onSave: (name?: string) => void
} {
	const [selectedDefinitionId, setSelectedDefinitionId] = useState<string>('')
	const [isEditingDefinition, setIsEditingDefinition] = useState<boolean>(false)
	const [isAddingDefinition, setIsAddingDefinition] = useState<boolean>(false)
	const [definitionName, setDefinitionName] = useState<string>('')
	const saveDefinition = useSaveDefinition()
	const definition = useSelectedDefinition(
		selectedDefinitionId,
		defineQuestionData,
	)

	useEffect(() => {
		if (!definition && defineQuestionData) {
			setSelectedDefinitionId(defineQuestionData.definition[0].id)
		}
	}, [selectedDefinitionId, setSelectedDefinitionId, defineQuestionData])

	const toggleEditDefinition = useCallback(() => {
		setIsEditingDefinition(prev => !prev)
		setDefinitionName(definition?.variable || '')
	}, [setIsEditingDefinition, definition, setDefinitionName])

	const toggleAddDefinition = useCallback(() => {
		setIsAddingDefinition(prev => !prev)
		setDefinitionName('New definition')
	}, [setDefinitionName, setDefinitionName])

	const onChange = useCallback(
		(_, value?: string) => {
			setDefinitionName(value || '')
		},
		[setDefinitionName],
	)

	const onSave = useCallback(
		(name?: string) => {
			const newId = v4()
			const props = isAddingDefinition
				? { id: newId, description: '', level: CausalityLevel.Secondary }
				: definition
			const newDefinition = {
				...props,
				variable: name,
			} as ElementDefinition
			saveDefinition(newDefinition)

			setIsEditingDefinition(false)
			setIsAddingDefinition(false)
			console.log(newId)
			setTimeout(() => {
				setSelectedDefinitionId(newId)
			}, 300)
		},
		[
			saveDefinition,
			setIsEditingDefinition,
			setIsAddingDefinition,
			isAddingDefinition,
			definition,
			setSelectedDefinitionId,
		],
	)

	return {
		selectedDefinitionId,
		setSelectedDefinitionId,
		isEditingDefinition,
		isAddingDefinition,
		toggleEditDefinition,
		onChange,
		toggleAddDefinition,
		onSave,
		definitionName,
	}
}

export function useTableTransform(selectedDefinition: string): {
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
	const [variables, setVariable] = useVariables(pageType)
	const originalTables = useOriginalTables()
	const tableColumns = useTableColumns(originalTables[0]?.tableId)
	const derive = useDeriveTable1(originalTables[0]?.tableId)
	const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] =
		useBoolean(false)
	const commands = useCommands(showModal, selectedDefinition)

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
	}, [originalTables, removedColumns])

	const handleTransformRequested = useCallback(
		async (step: Step, selectedDefinitionId: string) => {
			if (originalTable && step) {
				const output = await runPipeline(originalTable, [step])
				derive(output)
				//how would I know the type T
				//it's not all of them that have to
				//store the steps
				setVariable({
					steps: [...variables.flatMap(x => x.steps), step],
					id: selectedDefinitionId,
				})
			}
		},
		[originalTable, derive, variables, setVariable],
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

function useCommands(
	showModal: (
		ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
		item?: IContextualMenuItem,
	) => boolean | void,
	selectedDefinitionId: string,
) {
	const dccmd = useDeriveColumnCommand(showModal, selectedDefinitionId)
	return useMemo(() => [dccmd], [dccmd])
}

function useDeriveColumnCommand(
	onClick: (
		ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
		item?: IContextualMenuItem,
	) => boolean | void,
	selectedDefinitionId: string,
) {
	const cmd = useMemo(() => {
		return {
			key: 'derive-column',
			text: 'Create column',
			disabled: !selectedDefinitionId,
			iconProps: {
				iconName: 'Add',
			},
			onClick,
		}
	}, [onClick, selectedDefinitionId])
	return cmd
}

export function useCommandBar(
	definitionOptions: FactorsOrDefinitions,
	selectedDefinitionId: string,
	causalFactors: CausalFactor[],
	pageType: PageType,
	defineQuestionData: Element,
): IRenderFunction<IDetailsColumnProps> {
	const saveCausalFactor = useAddOrEditFactor()
	const saveDefinition = useSaveDefinition()
	const setTargetOnCausalFactor = useTargetOnCausalFactor(
		selectedDefinitionId,
		causalFactors,
		saveCausalFactor,
	)
	const setTargetVariable = useSetTargetVariable(
		selectedDefinitionId,
		saveDefinition,
		pageType,
		defineQuestionData,
		setTargetOnCausalFactor, //?????
	)

	return useCallback(
		(props?: IDetailsColumnProps) => {
			const selectedColumn = definitionOptions.find(
				x => x.id === selectedDefinitionId,
			)?.column
			const actualColumn = props?.column.name as string
			const items: ICommandBarItemProps[] = [
				{
					key: 'assignItem',
					text: 'Assign',
					iconOnly: true,
					buttonStyles: { root: { fontWeight: 'bold' } },
					onClick: () => setTargetVariable(actualColumn),
					checked: selectedColumn === actualColumn,
					iconProps: {
						//TODO: change icon props to new style on Chris's pR
						iconName: 'CheckMark',
					},
				},
				{
					key: 'duplicateItem',
					text: 'Duplicate',
					iconOnly: true,
					iconProps: { iconName: 'DuplicateRow' },
				},
				{
					key: 'addItem',
					text: 'Add from this column',
					iconOnly: true,
					iconProps: { iconName: 'Add' },
				},
			]
			return createDefaultCommandBar(items)
		},
		[definitionOptions, selectedDefinitionId, setTargetVariable],
	)
}

function useSetTargetVariable(
	selectedDefinitionId: string,
	saveDefinition: (definition: CausalFactor) => void,
	type: PageType,
	defineQuestionData: Element,
	setTargetOnCausalFactor: (val: any) => void,
) {
	return useCallback(
		(value: string) => {
			if (type === PageType.Control) {
				return setTargetOnCausalFactor(value)
			}
			const newDefinition = {
				...defineQuestionData?.definition.find(
					x => x.id === selectedDefinitionId,
				),
			} as CausalFactor

			if (newDefinition) {
				newDefinition.column =
					newDefinition.column === value ? undefined : value
			}

			saveDefinition(newDefinition)
		},
		[
			selectedDefinitionId,
			saveDefinition,
			type,
			defineQuestionData?.definition,
			setTargetOnCausalFactor,
		],
	)
}

function useTargetOnCausalFactor(
	selectedDefinitionId: string,
	causalFactors: CausalFactor[],
	saveCausalFactor: (causalFactor: CausalFactor) => void,
) {
	return useCallback(
		(val: any) => {
			const selectedCausal = {
				...causalFactors.find(x => x.id === selectedDefinitionId),
			} as CausalFactor

			if (selectedCausal) {
				selectedCausal.column = val.text
			}

			saveCausalFactor(selectedCausal)
		},
		[selectedDefinitionId, causalFactors, saveCausalFactor],
	)
}

export function useTable(
	selectedDefinitionId: string,
	variables: VariableDefinition1[],
	originalTable?: ColumnTable,
): ColumnTable {
	const originalTables = useOriginalTables()
	const tableColumns = useTableColumns(originalTables[0]?.tableId)

	const key = useMemo((): string => {
		return (
			tableColumns?.find(x => x.relevance === ColumnRelevance.SubjectIdentifier)
				?.name || ''
		)
	}, [tableColumns])

	return useMemo((): any => {
		if (!originalTable) {
			return aq.table({})
		}

		if (!variables.length) {
			return originalTable.select([key])
		}

		const steps =
			variables
				.find(a => a.id === selectedDefinitionId)
				?.steps.flatMap(s => s.args.to) || []
		//this works while we're doing commands with to arg
		return originalTable?.select([key, ...steps])
	}, [originalTable, variables, selectedDefinitionId, key])
}

//review output column
function useVariables(
	pageType: PageType,
): [VariableDefinition1[], (variableDefinition: VariableDefinition1) => void] {
	const population = usePopulationVariables()
	const exposure = useExposureVariables()
	const outcome = useOutcomeVariables()
	const setPopulation = useSetOrUpdatePopulationVariables()
	const setExposure = useSetOrUpdateExposureVariables()
	const setOutcome = useSetOrUpdateOutcomeVariables()

	return useMemo(() => {
		switch (pageType) {
			case PageType.Population:
				return [population, setPopulation]
			case PageType.Exposure:
				return [exposure, setExposure]
			case PageType.Outcome:
				return [outcome, setOutcome]
			default:
				return [[], () => undefined]
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

function useDefinitionOptions({
	defineQuestionData,
	pageType,
	causalFactors,
}: Omit<
	SelectedArgs,
	'definitionOptions' | 'selectedDefinition'
>): FactorsOrDefinitions {
	return useMemo((): FactorsOrDefinitions => {
		if (pageType === PageType.Control) {
			return causalFactors
		}
		return defineQuestionData?.definition || []
	}, [defineQuestionData, causalFactors, pageType])
}
