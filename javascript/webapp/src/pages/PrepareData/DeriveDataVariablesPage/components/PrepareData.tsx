/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Step, TableContainer } from '@data-wrangling-components/core'
import { PrepareDataFull } from '@data-wrangling-components/react'
import type { IDetailsColumnProps, IRenderFunction } from '@fluentui/react'
import type { FC } from 'react'
import { memo, useCallback, useMemo } from 'react'

import {
	useProjectFiles,
	useSetOutputTablePrep,
	useSetTablesPrepSpecification,
	useTablesPrepSpecification,
} from '~state'

interface Props {
	commandBar: IRenderFunction<IDetailsColumnProps>
}
export const PrepareData: FC<Props> = memo(function PrepareData({
	commandBar,
}) {
	const projectFiles = useProjectFiles()
	const setOutputTable = useSetOutputTablePrep()
	const prepSpecification = useTablesPrepSpecification()
	const setStepsTablePrep = useSetTablesPrepSpecification()

	const tables = useMemo((): TableContainer[] => {
		return projectFiles.map(f => {
			return {
				id: f.name,
				name: f.name,
				table: f.table,
			} as TableContainer
		})
	}, [projectFiles])

	const steps = useMemo((): any => {
		return prepSpecification !== undefined ? prepSpecification[0]?.steps : []
	}, [prepSpecification])

	const onChangeSteps = useCallback(
		(steps: Step[]) => {
			setStepsTablePrep(prev => {
				const _prev = [...(prev ?? [])]
				_prev[0] = { ..._prev[0], steps }
				return _prev
			})
		},
		[setStepsTablePrep],
	)

	const onUpdateOutput = useCallback(
		(table: TableContainer) => {
			setOutputTable(table.table)
		},
		[setOutputTable],
	)

	return (
		<PrepareDataFull
			steps={steps}
			onUpdateSteps={onChangeSteps}
			onOutputTable={onUpdateOutput}
			tables={tables}
			outputHeaderCommandBar={[commandBar]}
		/>
	)
})
