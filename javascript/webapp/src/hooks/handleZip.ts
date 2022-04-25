/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	BaseFile,
	FileCollection,
} from '@data-wrangling-components/utilities'
import { FileType } from '@data-wrangling-components/utilities'
import type { AsyncHandler1 } from '@showwhy/types'

import type { FileDefinition } from '~types'
import { ProjectSource } from '~types'
import { groupFilesByType, isZipUrl } from '~utils'

import { useLoadProject } from './loadProject'

async function validateProjectFiles(
	fileCollection: FileCollection,
): Promise<boolean> {
	if (!fileCollection) {
		throw new Error('No file collection provided')
	}

	const jsonFile: BaseFile | undefined = fileCollection
		.list(FileType.json)
		.find(a => a.path === 'workspace_config.json')
	if (!jsonFile) {
		throw new Error('No JSON file found in zip')
	}
	const jsonTables = (await jsonFile.toJson())['tables'] as FileDefinition[]
	const tableEntries = fileCollection.list(FileType.table).map(e => e.name)

	const requiredTables = jsonTables
		.filter(t => isZipUrl(t.url))
		.map(t => t.name)

	const hasRequiredTables = requiredTables.every(table =>
		tableEntries.includes(table),
	)
	if (!hasRequiredTables) {
		throw new Error('Required table from .json file not found in zip')
	}
	return true
}

export function useHandleFiles(
	onError: (msg: string) => void,
): AsyncHandler1<FileCollection> {
	const loadProject = useLoadProject(ProjectSource.zip)
	return async function handleFiles(fileCollection: FileCollection) {
		if (!fileCollection) return
		try {
			/* eslint-disable @essex/adjacent-await */
			await validateProjectFiles(fileCollection)
			const files = await groupFilesByType(fileCollection)
			loadProject(undefined, files)
		} catch (e) {
			onError((e as Error).message)
		}
	}
}
