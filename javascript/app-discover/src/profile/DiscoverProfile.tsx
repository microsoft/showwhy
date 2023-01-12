/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	ProfilePlugin,
	AppProfileInitializationContext,
} from '@datashaper/app-framework'
import { CommandBarSection } from '@datashaper/app-framework'
import type { DataPackage } from '@datashaper/workflow'
import type { IContextualMenuItem } from '@fluentui/react'
import { DiscoverResource } from './DiscoverResource.js'
import { DiscoverAppRoot } from './DiscoverAppRoot.js'
import { DiscoverResourceSchema } from './DiscoverResourceSchema.js'

const DISCOVERY_PROFILE = 'showwhy-discover'

export class DiscoverProfile implements ProfilePlugin<DiscoverResource> {
	public readonly profile = DISCOVERY_PROFILE
	public readonly title = 'Causal Discovery'
	public readonly iconName = 'SearchData'

	public renderer = DiscoverAppRoot
	private _dataPackage: DataPackage | undefined

	public initialize({ dataPackage }: AppProfileInitializationContext) {
		this._dataPackage = dataPackage
	}

	public async createInstance(schema?: DiscoverResourceSchema) {
		return new DiscoverResource(schema)
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
						this.createInstance?.().then(resource => {
							resource.name = dp.suggestResourceName(resource.name)
							dp.addResource(resource)
						})
					},
				},
			]
		}
	}
}
