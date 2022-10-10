/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import { DataFormat } from '@datashaper/schema'
import type { DataTable } from '@datashaper/workflow'
import { useCallback, useEffect, useState } from 'react'

export function useContent(dataPackage: DataTable): string {
	const [content, setContent] = useState('')
	const isJson = dataPackage.toSchema().format === DataFormat.JSON
	useEffect(() => {
		const f = async () => {
			const _content = await dataPackage.data?.text()
			setContent(isJson && _content != null ? JSON.parse(_content) : _content)
		}
		void f()
	}, [dataPackage, setContent, isJson])

	return isJson ? JSON.stringify(content, undefined, 2) : content
}

export function useOnChange(
	dataPackage: DataTable,
): (value: string | undefined) => void {
	return useCallback(
		(value?: string) => {
			dataPackage.data = new Blob([value ?? ''])
		},
		[dataPackage],
	)
}
