/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { PrepareDataFull } from '@datashaper/react'
import type { TableContainer } from '@essex/arquero'
import type { IDetailsColumnProps, IRenderFunction } from '@fluentui/react'
import type { FC } from 'react'
import { memo, useEffect, useMemo, useState } from 'react'

import { useOutputs, useProjectFiles, useWorkflowState } from '~state'

interface Props {
	commandBar: IRenderFunction<IDetailsColumnProps>
}
export const PrepareData: FC<Props> = memo(function PrepareData({
	commandBar,
}) {
	const projectFiles = useProjectFiles()
	const [selectedTableId, setSelectedTableId] = useState<string | undefined>()
	const [outputs, setOutputs] = useOutputs()
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
		const len = outputs?.length ?? 0
		if (len) {
			setSelectedTableId(prev => (!prev ? outputs[len - 1]?.id : prev))
		} else {
			setSelectedTableId(prev => (!prev ? tables[0]?.id : prev))
		}
	}, [outputs, tables, setSelectedTableId])

	return (
		<PrepareDataFull
			inputs={tables}
			derived={outputs}
			workflow={workflow}
			selectedTableId={selectedTableId}
			onSelectedTableIdChanged={setSelectedTableId}
			onUpdateOutput={setOutputs}
			outputHeaderCommandBar={[commandBar]}
			onUpdateWorkflow={setWorkflow}
		/>
	)
})
