/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { not } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback } from 'react'

import { OUTPUT_FILE_NAME } from '../../pages/AnalyzeTestPage.constants.js'
import { api } from '../../resources/api.js'
import { useCausalFactors } from '../../state/causalFactors.js'
import { useDefinitions } from '../../state/definitions.js'
import type { UploadFileResponse } from '../../types/api/UploadFileResponse.js'
import type { Handler1, Maybe } from '../../types/primitives.js'
import { createFormData } from '../../utils/files.js'
import { useOutputTable } from '../useOutputTable.js'
import { useAllColumns } from './useAllColumns.js'

export function useUploadFile(
	setErrors: Handler1<string>,
): () => Promise<Maybe<UploadFileResponse>> {
	const outputTable = useOutputTable()
	const definitions = useDefinitions()
	const causalFactors = useCausalFactors()
	const allColumns = useAllColumns(causalFactors, definitions)

	const uploadOutputFile = useCallback((file: ColumnTable) => {
		const filesData = createFormData(file, OUTPUT_FILE_NAME)
		return api.uploadFile(filesData)
	}, [])

	return useCallback(async () => {
		let output = outputTable as ColumnTable
		if (outputTable) {
			output = outputTable
		}

		if (allColumns) {
			const existingColumns = output.columnNames()
			const unusedColumns = existingColumns.filter(
				(c) => !allColumns.includes(c),
			)
			output = output?.select(not(unusedColumns))
		}
		const files = await uploadOutputFile(output).catch((err) => {
			setErrors(
				//eslint-disable-next-line
				(err.message as string) ||
					'Unknown error, please contact the system admin.',
			)
		})
		if (!files) return undefined
		return files
	}, [allColumns, uploadOutputFile, outputTable, setErrors])
}
