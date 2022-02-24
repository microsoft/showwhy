/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	Step,
	introspect,
	TableContainer,
} from '@data-wrangling-components/core'
import { createDefaultCommandBar } from '@data-wrangling-components/react'
import {
	ICommandBarItemProps,
	IDetailsColumnProps,
	IRenderFunction,
	Dropdown,
	ICommandBarProps,
	IDropdownOption,
} from '@fluentui/react'
import { useCallback, useMemo, useState } from 'react'
import { useAddOrEditFactor, useSaveDefinition } from '~hooks'
import {
	useSubjectIdentifier,
	useProjectFiles,
	useSetSubjectIdentifier,
	useSetOutputTablePrep,
	useTablesPrepSpecification,
	useSetTablesPrepSpecification,
	useCausalFactors,
	useDefineQuestion,
	useSetDefineQuestion,
} from '~state'
import { Maybe } from '~types'
import { DefinitionType, useDefinitionDropdown } from '../ModelVariables/hooks'
import { useSetTargetCausalFactor } from './hooks/useSetTargetCausalFactor'
import { useSetTargetDefinition } from './hooks/useSetTargetDefinition'

export function useBusinessLogic(): {
	tables: TableContainer[]
	steps?: Step[]
	onChangeSteps: (step: Step[]) => void
	commandBar: IRenderFunction<IDetailsColumnProps>
} {
	const projectFiles = useProjectFiles()
	const prepSpecification = useTablesPrepSpecification()
	const setStepsTablePrep = useSetTablesPrepSpecification()
	const setOutputTablePrep = useSetOutputTablePrep()
	const causalFactors = useCausalFactors()

	const [columnsMicrodata, setColumnsMicrodata] = useState<string[]>([])
	const subjectIdentifier = useSubjectIdentifier()
	const setSubjectIdentifier = useSetSubjectIdentifier()
	const defineQuestion = useDefineQuestion()
	const setDefineQuestion = useSetDefineQuestion()

	const definitionDropdown = useDefinitionDropdown(
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

	// const updateMicrodata = useCallback(async () => {
	// 	if (!projectFiles.length) return
	// 	const output = await runPipelineFromProjectFiles(projectFiles, steps)
	// 	const stats = introspect(output, true)
	// 	const columnNames = Object.keys(stats.columns)
	// 	const columns = columnNames.filter(c => {
	// 		return stats.columns[c].stats?.distinct === stats.rows
	// 	})
	// 	setOutputTablePrep(output)
	// 	setColumnsMicrodata(columns)
	// }, [projectFiles, steps, setColumnsMicrodata, setOutputTablePrep])

	// useEffect(() => {
	// 	const f = async () => {
	// 		updateMicrodata()
	// 	}
	// 	f()
	// }, [steps, updateMicrodata])

	const tables = useMemo((): TableContainer[] => {
		return projectFiles.map(x => {
			return {
				id: x.id,
				name: x.name,
				table: x.table,
			} as TableContainer
		})
	}, [projectFiles])

	const onSaveCausalFactor = useAddOrEditFactor()
	const setCausalFactor = useSetTargetCausalFactor(
		onSaveCausalFactor,
		causalFactors,
	)
	const onSaveDefinition = useSaveDefinition(defineQuestion, setDefineQuestion)
	const setDefinition = useSetTargetDefinition(onSaveDefinition, defineQuestion)

	const onSelect = useCallback(
		(option: Maybe<IDropdownOption<any>>, columnName: string) => {
			if (option?.data.type === DefinitionType.Factor) {
				return setCausalFactor(option?.key as string, columnName)
			}
			setDefinition(option?.key as string, columnName)
		},
		[setCausalFactor, setDefinition],
	)

	const allElements = useMemo(() => {
		const { population, exposure, outcome } = defineQuestion
		return causalFactors.concat(
			population?.definition,
			exposure?.definition,
			outcome?.definition,
		)
	}, [causalFactors, defineQuestion])

	const renderDropdown = useCallback(
		(columnName: string) => {
			return (
				<Dropdown
					selectedKey={allElements.find(a => a.column === columnName)?.id}
					onChange={(_, option) => onSelect(option, columnName)}
					style={{ width: '200px' }}
					options={definitionDropdown}
				/>
			)
		},
		[definitionDropdown],
	)

	const commandBar = useCallback(
		(props?: IDetailsColumnProps) => {
			const columnName = props?.column.name ?? ''
			const items: ICommandBarItemProps[] = [
				{
					key: 'definition',
					iconOnly: true,
					onRender: props => renderDropdown(columnName),
				},
			]
			return createDefaultCommandBar(items, {
				style: { width: 200 },
			} as ICommandBarProps)
		},
		[setSubjectIdentifier, renderDropdown, subjectIdentifier, columnsMicrodata],
	)

	return {
		tables,
		onChangeSteps,
		steps,
		commandBar,
	}
}

const iconProps = {
	key: { iconName: 'Permissions' },
	block: { iconName: 'StatusCircleBlock2' },
}
