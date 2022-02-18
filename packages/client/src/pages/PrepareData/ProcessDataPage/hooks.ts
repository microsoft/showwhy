/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Step, introspect } from '@data-wrangling-components/core'
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
	useSetStepsTablePrep,
	useStepsTablePrep,
} from '~state'
import { runPipelineFromProjectFiles } from '~utils'

export function useBusinessLogic(): {
	files: BaseFile[]
	steps?: Step[]
	onChangeSteps: (step: Step[]) => void
	commandBar: IRenderFunction<IDetailsColumnProps>
} {
	const projectFiles = useProjectFiles()
	const steps = useStepsTablePrep()
	const setStepsTablePrep = useSetStepsTablePrep()

	const [columnsMicrodata, setColumnsMicrodata] = useState<string[]>([])
	const subjectIdentifier = useSubjectIdentifier()
	const setSubjectIdentifier = useSetSubjectIdentifier()

	const onChangeSteps = useCallback(
		(steps: Step[]) => {
			setStepsTablePrep(steps)
			setSubjectIdentifier(undefined)
		},
		[setStepsTablePrep, setSubjectIdentifier],
	)

	const updateMicrodata = useCallback(async () => {
		const output = await runPipelineFromProjectFiles(projectFiles, steps)
		const stats = introspect(output, true)
		const columnNames = Object.keys(stats.columns)
		const columns = columnNames.filter(c => {
			return stats.columns[c].stats?.distinct === stats.rows
		})
		setColumnsMicrodata(columns)
	}, [projectFiles, steps, setColumnsMicrodata])

	useEffect(() => {
		const f = async () => {
			updateMicrodata()
		}
		f()
	}, [steps, updateMicrodata])

	const files = useMemo((): BaseFile[] => {
		return projectFiles.map(x => {
			const file = new Blob([x.content], {
				type: 'text/csv',
			})
			return createBaseFile(file, { name: x.name })
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
		files,
		onChangeSteps,
		steps,
		commandBar,
	}
}

const iconProps = {
	key: { iconName: 'Permissions' },
	block: { iconName: 'StatusCircleBlock2' },
}
