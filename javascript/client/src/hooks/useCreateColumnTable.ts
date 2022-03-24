/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { BaseFile } from '@data-wrangling-components/utilities'
import type { Handler, Handler1 } from '@showwhy/types'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import type { ProjectFile } from '~types'
import { useEffect, useState, useCallback } from 'react'
import { useBoolean } from '@fluentui/react-hooks'
import { op, all } from 'arquero'
import { readFile } from '~utils'

// const CHUNK_SIZE = 31457280 //1024 * 1024 * 30
// const MAX_TO_SPLIT = 350000000 //350MB

// function createReader() {
// 	const reader = new FileReader()
// 	reader.onabort = () => console.log('file reading was aborted')
// 	reader.onerror = () => console.log('file reading has failed')
// 	return reader
// }

export function useCreateColumnTable(
	onFileLoad: Handler1<ProjectFile>,
	onLoadStart?: Handler,
): (files: BaseFile[], delimiter?: string) => void {
	const [table, setTable] = useState<ColumnTable>()
	const [fileName, setFileName] = useState('')
	const [isFinished, { setFalse: setNotFinished, setTrue: setFinished }] =
		useBoolean(false)

	useEffect((): any => {
		if (isFinished && table) {
			setNotFinished()
			const _table = (table as ColumnTable).derive(
				{
					index: op.row_number(),
				},
				{ before: all() },
			)
			onFileLoad({
				table: _table,
				name: fileName,
			})
		}
	}, [isFinished, setNotFinished, onFileLoad, table, fileName])

	return useCallback(
		(files: BaseFile[], delimiter?: string) => {
			onLoadStart && onLoadStart()
			files.forEach(async (file: BaseFile) => {
				setNotFinished()
				const name = file.name
				setFileName(name)

				const isDone = await readFile(file, delimiter)
				setFinished()
				setTable(isDone)
			})
		},
		[onLoadStart, setTable, setNotFinished, setFileName, setFinished],
	)
}

// function readFile(file: BaseFile, delimiter?: string): Promise<ColumnTable> {
// 	const _delimeter = delimiter || guessDelimiter(file.name)
// 	//this
// 	const isBigFile = file.size > MAX_TO_SPLIT
// 	const reader = createReader()
// 	let index = 0
// 	const size = CHUNK_SIZE
// 	let columnNames: string[] = []
// 	let error = ''
// 	let table: ColumnTable | undefined = undefined

// 	reader.onload = () => {
// 		console.debug('file reading started')
// 		const content = reader.result
// 			? reader.result.toString().replace(/ï»¿/g, '')
// 			: ''

// 		let lineBreak = content
// 		let columnsIndex = 0
// 		if (isBigFile) {
// 			/**
// 			 * stores columnNames
// 			 */
// 			if (index === 0) {
// 				columnsIndex = content.indexOf('\n')
// 				const columns = content.slice(0, columnsIndex)
// 				columnNames = columns.split(',')
// 				/**
// 				 * include \n into account
// 				 */
// 				columnsIndex++
// 			}

// 			lineBreak =
// 				content.length < size
// 					? content
// 					: content.slice(columnsIndex, content.lastIndexOf('\n') + 1)
// 			const lineBreakExcess = content.length - lineBreak.length - columnsIndex

// 			//write a doc about that
// 			index = index + size - lineBreakExcess
// 		}
// 		try {
// 			const result = createDefaultTable(lineBreak, _delimeter, columnNames)
// 			if (!table) {
// 				table = result
// 			} else {
// 				table = table?.concat(result)
// 			}
// 		} catch (e: any) {
// 			error = e
// 		}
// 	}

// 	if (isBigFile) {
// 		reader.readAsBinaryString(file.slice(index, index + size))
// 	} else {
// 		reader.readAsBinaryString(file)
// 	}

// 	return new Promise(resolve => {
// 		reader.onloadend = () => {
// 			if (error) {
// 				console.log('file reading has failed')
// 			}
// 			if (isBigFile && index < file.size) {
// 				reader.readAsBinaryString(file.slice(index, index + size))
// 			} else {
// 				console.debug('file reading ended')
// 				return resolve(table as ColumnTable)
// 			}
// 		}
// 	})
// }
