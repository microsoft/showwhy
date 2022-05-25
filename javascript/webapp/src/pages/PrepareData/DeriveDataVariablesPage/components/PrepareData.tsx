/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@essex/arquero'
import { PrepareDataFull } from '@data-wrangling-components/react'
import type { IDetailsColumnProps, IRenderFunction } from '@fluentui/react'
import { FC, useEffect, useState } from 'react'
import { memo, useMemo } from 'react'

import { useOutput, useProjectFiles, useWorkflow } from '~state'
import { cloneDeep } from 'lodash'

interface Props {
	commandBar: IRenderFunction<IDetailsColumnProps>
}
export const PrepareData: FC<Props> = memo(function PrepareData({
	commandBar,
}) {
	const projectFiles = useProjectFiles()

	const [selectedTableId, setSelectedTableId] = useState<string | undefined>()
	const workflow = useWorkflow()
	const [output, setOutput] = useOutput()
	const wf = useMemo(() => cloneDeep(workflow), [workflow])

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
		}
	}, [output, setSelectedTableId])

	return (
		<PrepareDataFull
			inputs={tables}
			derived={output}
			workflow={wf}
			selectedTableId={selectedTableId}
			onSelectedTableIdChanged={setSelectedTableId}
			onUpdateOutput={setOutput}
			outputHeaderCommandBar={[commandBar]}
		/>
	)
})
