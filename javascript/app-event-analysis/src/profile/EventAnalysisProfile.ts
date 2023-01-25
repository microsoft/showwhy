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

import { EVENTS_PROFILE } from './constants.js'
import { EventAnalysisResource } from './EventAnalysisResource.js'
import type { EventAnalysisResourceSchema } from './EventAnalysisResourceSchema.js'
import { EventsAppRoot } from './EventsAppRoot.js'

export class EventAnalysisProfile
	implements ProfilePlugin<EventAnalysisResource>
{
	public readonly profile = EVENTS_PROFILE
	public readonly title = 'Event Analysis'
	public readonly iconName = 'Event'

	public renderer = EventsAppRoot
	private _dataPackage: DataPackage | undefined

	public initialize({ dataPackage }: AppProfileInitializationContext) {
		this._dataPackage = dataPackage
	}

	public createInstance(
		schema?: EventAnalysisResourceSchema,
	): Promise<EventAnalysisResource> {
		const result = new EventAnalysisResource()
		if (schema != null) {
			result.loadSchema(schema)
		}
		return Promise.resolve(result)
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
