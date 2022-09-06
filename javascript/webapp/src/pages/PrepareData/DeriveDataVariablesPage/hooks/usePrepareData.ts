/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@datashaper/arquero'
import type { Workflow } from '@datashaper/core'
import type { Handler1, Maybe } from '@showwhy/types'
import { useEffect, useMemo, useState } from 'react'

import { useOutputs, useProjectFiles, useWorkflowState } from '~state'

export function usePrepareData(): {
	tables: TableContainer[]
	workflow: Workflow
	setWorkflow: Handler1<Workflow>
	selectedTableId: Maybe<string>
	setSelectedTableId: Handler1<Maybe<string>>
	outputs: TableContainer[]
	setOutputs: Handler1<TableContainer[]>
} {
	const projectFiles = useProjectFiles()
	const [workflow, setWorkflow] = useWorkflowState()

	const [selectedTableId, setSelectedTableId] = useState<string | undefined>()
	const [outputs, setOutputs] = useOutputs()

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

	return {
		tables,
		workflow,
		setWorkflow,
		selectedTableId,
		setSelectedTableId,
		outputs,
		setOutputs,
	}
}
