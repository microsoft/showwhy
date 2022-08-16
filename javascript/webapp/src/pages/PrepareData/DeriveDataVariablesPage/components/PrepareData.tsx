/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { PrepareDataFull } from '@datashaper/react'
import type { TableContainer } from '@essex/arquero'
import type { IDetailsColumnProps, IRenderFunction } from '@fluentui/react'
import type { FC } from 'react'
import { memo, useEffect, useMemo, useState } from 'react'

import { useOutput, useProjectFiles, useWorkflowState } from '~state'

interface Props {
	commandBar: IRenderFunction<IDetailsColumnProps>
}
export const PrepareData: FC<Props> = memo(function PrepareData({
	commandBar,
}) {
	const projectFiles = useProjectFiles()
	const [selectedTableId, setSelectedTableId] = useState<string | undefined>()
	const [output, setOutput] = useOutput()
	const [workflow, setWorkflow] = useWorkflowState()
	const tables = useMemo((): TableContainer[] => {
		return projectFiles.map(f => {
			return {
				id: f.name,
				name: f.name,
				table: f.table,
			} as TableContainer
		})
	}, [projectFiles])

	useEffect(() => {
		const len = output?.length ?? 0
		if (len) {
			setSelectedTableId(prev => (!prev ? output[len - 1]?.id : prev))
		} else {
			setSelectedTableId(prev => (!prev ? tables[0]?.id : prev))
		}
	}, [output, tables, setSelectedTableId])

	return (
		<PrepareDataFull
			inputs={tables}
			derived={output}
			workflow={workflow}
			selectedTableId={selectedTableId}
			onSelectedTableIdChanged={setSelectedTableId}
			onUpdateOutput={setOutput}
			outputHeaderCommandBar={[commandBar]}
			onUpdateWorkflow={setWorkflow}
		/>
	)
})
