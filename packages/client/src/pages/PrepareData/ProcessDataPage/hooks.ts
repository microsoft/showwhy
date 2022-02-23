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
import { BaseFile, createBaseFile } from '@data-wrangling-components/utilities'
import {
	ICommandBarItemProps,
	IDetailsColumnProps,
	IRenderFunction,
} from '@fluentui/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
	useSubjectIdentifier,
	useProjectFiles,
	useSetSubjectIdentifier,
	useSetOutputTablePrep,
	useTablesPrepSpecification,
	useSetTablesPrepSpecification,
} from '~state'
import { runPipelineFromProjectFiles } from '~utils'

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

	const [columnsMicrodata, setColumnsMicrodata] = useState<string[]>([])
	const subjectIdentifier = useSubjectIdentifier()
	const setSubjectIdentifier = useSetSubjectIdentifier()

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
		return prepSpecification.length ? prepSpecification[0].steps : []
	}, [prepSpecification])

	const updateMicrodata = useCallback(async () => {
		if (!projectFiles.length) return
		const output = await runPipelineFromProjectFiles(projectFiles, steps)
		const stats = introspect(output, true)
		const columnNames = Object.keys(stats.columns)
		const columns = columnNames.filter(c => {
			return stats.columns[c].stats?.distinct === stats.rows
		})
		setOutputTablePrep(output)
		setColumnsMicrodata(columns)
	}, [projectFiles, steps, setColumnsMicrodata, setOutputTablePrep])

	useEffect(() => {
		const f = async () => {
			updateMicrodata()
		}
		f()
	}, [steps, updateMicrodata])

	const tables = useMemo((): TableContainer[] => {
		return projectFiles.map(x => {
			return {
				name: x.name,
				table: x.table,
			}
		})
	}, [projectFiles])

	const commandBar = useCallback(
		(props?: IDetailsColumnProps) => {
			const columnName = props?.column.name ?? ''
			const canBeIdentifier = columnsMicrodata.includes(columnName)
			const items: ICommandBarItemProps[] = [
				{
					key: 'subjectIdentifier',
					text: canBeIdentifier
						? 'Set as subject Identifier'
						: "Can't be a subject identifier",
					iconOnly: true,
					iconProps: canBeIdentifier ? iconProps.key : iconProps.block,
					toggle: true,
					disabled:
						!canBeIdentifier ||
						(!!subjectIdentifier && subjectIdentifier !== columnName),
					checked: subjectIdentifier === columnName,
					onClick: () => setSubjectIdentifier(columnName),
				},
			]
			return createDefaultCommandBar(items)
		},
		[setSubjectIdentifier, subjectIdentifier, columnsMicrodata],
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
