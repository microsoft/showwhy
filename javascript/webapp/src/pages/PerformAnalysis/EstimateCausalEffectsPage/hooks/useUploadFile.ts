/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	Handler,
	Handler1,
	Maybe,
	UploadFilesResponse,
} from '@showwhy/types'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback } from 'react'

import { api } from '~resources'
import {
	useCausalFactors,
	useDefinitions,
	useOutputTablePrep,
	useProjectFiles,
} from '~state'
import { createZipFormData } from '~utils'

import { OUTPUT_FILE_NAME } from '../EstimateCausalEffectPage.constants'
import { useAllColumns } from './useAllColumns'

export function useUploadFile(
	setErrors: Handler1<string>,
	falseLoadingFile: Handler,
): () => Promise<Maybe<UploadFilesResponse>> {
	const projectFiles = useProjectFiles()
	const outputTablePrep = useOutputTablePrep()
	const definitions = useDefinitions()
	const causalFactors = useCausalFactors()
	const allColumns = useAllColumns(causalFactors, definitions)

	const uploadOutputFile = useCallback(async (file: ColumnTable) => {
		const filesData = await createZipFormData(file, OUTPUT_FILE_NAME)
		return api.uploadFiles(filesData)
	}, [])

	return useCallback(async () => {
		let output = projectFiles[0]?.table as ColumnTable
		if (outputTablePrep) {
			output = outputTablePrep
		}

		if (allColumns) {
			output = output?.select(allColumns)
		}
		const files = await uploadOutputFile(output)
			.catch(err => {
				setErrors(
					err.message || 'Unknown error, please contact the system admin.',
				)
			})
			.finally(() => {
				falseLoadingFile()
			})
		if (!files) return undefined
		return files
	}, [
		projectFiles,
		allColumns,
		uploadOutputFile,
		falseLoadingFile,
		outputTablePrep,
		setErrors,
	])
}
