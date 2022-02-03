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
import { useBoolean } from '@fluentui/react-hooks'
import * as aq from 'arquero'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback, useMemo, useState } from 'react'
import { useDeriveTable1, usePageType } from '~hooks'
import {
	usePopulationVariables,
	useExposureVariables,
	useOutcomeVariables,
	useControlVariables,
	useSetOrUpdatePopulationVariables,
	useSetOrUpdateExposureVariables,
	useSetOrUpdateOutcomeVariables,
	useSetOrUpdateControlVariables,
	useOriginalTables,
	useTableColumns,
} from '~state'
import {
	CausalFactor,
	ColumnRelevance,
	ElementDefinition,
	FactorsOrDefinitions,
	Handler,
	PageType,
	RenameCalloutArgs,
	RenameCalloutType,
	TransformTable,
	VariableDefinition,
} from '~types'
import { SharedLogic } from './interfaces'

export function useSharedBusinessLogic(): SharedLogic {
	const [showConfirmDelete, { toggle: toggleShowConfirmDelete }] =
		useBoolean(false)

	return {
		showConfirmDelete,
		toggleShowConfirmDelete,
	}
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

export function useVariables(
	pageType: PageType,
): [VariableDefinition[], (variableDefinition: VariableDefinition) => void] {
	const population = usePopulationVariables()
	const exposure = useExposureVariables()
	const outcome = useOutcomeVariables()
	const control = useControlVariables()
	const setPopulation = useSetOrUpdatePopulationVariables()
	const setExposure = useSetOrUpdateExposureVariables()
	const setOutcome = useSetOrUpdateOutcomeVariables()
	const setControl = useSetOrUpdateControlVariables()

	return useMemo(() => {
		switch (pageType) {
			case PageType.Population:
				return [population, setPopulation]
			case PageType.Exposure:
				return [exposure, setExposure]
			case PageType.Outcome:
				return [outcome, setOutcome]
			case PageType.Control:
				return [control, setControl]
			default:
				return [[], () => undefined]
		}
	}, [
		pageType,
		population,
		exposure,
		outcome,
		control,
		setPopulation,
		setExposure,
		setOutcome,
		setControl,
	])
}

export function useTable(
	selectedDefinitionId: string,
	variables: VariableDefinition[],
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

export function useCommandBar(
	definitionOptions: FactorsOrDefinitions,
	selectedDefinitionId: string,
	setTargetVariable: (actualColumn: string) => void,
): IRenderFunction<IDetailsColumnProps> {
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

export function useTableTransform(selectedDefinition: string): TransformTable {
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
			? originalTables[0].table.select(aq.not(removedColumns))
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

export function useRenameCallout(
	definition?: ElementDefinition | CausalFactor,
): RenameCalloutArgs {
	const [calloutOpen, setCalloutOpen] = useState<
		RenameCalloutType | undefined
	>()
	const [definitionName, setDefinitionName] = useState<string>('')

	const toggleCallout = useCallback(
		(type?: RenameCalloutType) => {
			setCalloutOpen(type)
			let name = definition?.variable ?? ''
			switch (type) {
				case RenameCalloutType.New:
					name = 'New definition'
					break
				case RenameCalloutType.Duplicate:
					name += ' new'
					break
			}
			setDefinitionName(name)
		},
		[setCalloutOpen, setDefinitionName, definition],
	)

	return {
		calloutOpen,
		toggleCallout,
		definitionName,
	}
}
