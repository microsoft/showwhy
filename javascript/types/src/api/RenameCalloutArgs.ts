/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { RenameCalloutType } from './RenameCalloutType'

export interface RenameCalloutArgs {
	toggleCallout: (type?: RenameCalloutType) => void
	definitionName: string
	calloutOpen?: RenameCalloutType
}
