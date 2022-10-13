/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ResourceSchema } from '@datashaper/schema'
import type { ResourceHandler } from '@datashaper/workflow'

export class AppResourceHandler<JsonForm> implements ResourceHandler {
	public constructor(
		public readonly name: string,
		public readonly profile: string,
		private getProjectJson: () => JsonForm,
		private loadProjectJson: (json: JsonForm) => void,
	) {}

	public save(files: Map<string, Blob>): Promise<string[]> {
		const filename = `apps/${this.name}.json`
		const data = this.getProjectJson()
		const resource = { profile: this.profile, name: this.name, data }
		const jsonText = JSON.stringify(resource, null, 2)
		const blob = new Blob([jsonText], { type: 'application/json' })
		files.set(filename, blob)
		return Promise.resolve([filename])
	}

	public canLoad(resource: ResourceSchema): boolean {
		return resource.profile === this.profile
	}

	public load(resource: ResourceSchema & { data: JsonForm }): Promise<void> {
		if (!resource.data) {
			throw new Error('could not load resource data')
		}
		this.loadProjectJson(resource.data)
		return Promise.resolve()
	}
}
