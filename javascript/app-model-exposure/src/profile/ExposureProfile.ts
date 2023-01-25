/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	AppProfileInitializationContext,
	ProfilePlugin,
} from '@datashaper/app-framework'
import { CommandBarSection } from '@datashaper/app-framework'
import type { DataPackage } from '@datashaper/workflow'
import type { IContextualMenuItem } from '@fluentui/react'
import content from '@showwhy/guidance'

import { EXPOSURE_PROFILE } from './constants.js'
import { ExposureAppRoot } from './ExposureAppRoot.js'
import { ExposureResource } from './ExposureResource.js'
import type { ExposureResourceSchema } from './ExposureResourceSchema.js'

export class ExposureProfile implements ProfilePlugin<ExposureResource> {
	public readonly profile = EXPOSURE_PROFILE
	public readonly title = 'Model Exposure'
	public readonly iconName = 'TestBeaker'

	public renderer = ExposureAppRoot

	private _dataPackage: DataPackage | undefined

	public initialize({ dataPackage }: AppProfileInitializationContext) {
		this._dataPackage = dataPackage
	}

	public createInstance(schema?: ExposureResourceSchema) {
		return Promise.resolve(new ExposureResource(schema))
	}

	public getCommandBarCommands(
		section: CommandBarSection,
	): IContextualMenuItem[] | undefined {
		const dp = this._dataPackage
		if (dp == null) {
			throw new Error('Data package not initialized')
		}
		if (section === CommandBarSection.New) {
			return [
				{
					key: this.profile,
					text: `New ${this.title}`,
					onClick: () => {
						void this.createInstance?.().then(resource => {
							resource.name = dp.suggestResourceName(resource.name)
							dp.addResource(resource)
						})
					},
				},
			]
		}
	}

	public getHelp() {
		return content
	}
}
