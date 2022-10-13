/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Persistable } from '@datashaper/workflow'

export class JsonPersistable<JsonForm> implements Persistable {
	public constructor(
		public readonly name: string,
		public readonly profile: string,
		private getProjectJson: () => JsonForm,
		private loadProjectJson: (json: JsonForm) => void,
	) {}

	public save(): Promise<Blob> {
		const json = this.getProjectJson()
		const jsonText = JSON.stringify(json, null, 2)
		return Promise.resolve(new Blob([jsonText], { type: 'application/json' }))
	}

	public async load(data: Blob): Promise<void> {
		const jsonText = await data.text()
		/* eslint-disable-next-line */
		const json = JSON.parse(jsonText) as JsonForm
		this.loadProjectJson(json)
	}
}
