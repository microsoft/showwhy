/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BaseFile } from '@datashaper/utilities'
import {
	FileCollection,
	FileWithPath,
	getFilesFromZip,
} from '@datashaper/utilities'
import type { DataPackage } from '@datashaper/workflow'

import type { PersistenceService } from './types.js'

const DEFAULT_PROJECT_NAME = 'project'

export class DefaultPersistenceService implements PersistenceService {
	public constructor(private readonly dataPackage: DataPackage) {}

	public async save(projectName = DEFAULT_PROJECT_NAME): Promise<void> {
		const files = await this.dataPackage.save()
		const collection = await toFileCollection(files)
		return collection.toZip(projectName)
	}

	public async load(pkg: BaseFile): Promise<void> {
		const files = hashFilesByPath(await getFilesFromZip(pkg))
		await this.dataPackage.load(files)
	}
}

function hashFilesByPath(files: FileWithPath[]): Map<string, FileWithPath> {
	const result = new Map<string, FileWithPath>()
	for (const file of files) {
		result.set(file.path, file)
	}
	return result
}

async function toFileCollection(
	files: Map<string, Blob>,
): Promise<FileCollection> {
	const fc = new FileCollection()
	for (const [path, file] of files) {
		await fc.add(new FileWithPath(file, path, path))
	}
	return fc
}
