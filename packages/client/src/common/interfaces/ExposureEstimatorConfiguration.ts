/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { IDropdownOption } from '@fluentui/react'

export interface ExposureEstimatorConfiguration {
	trimmingLevel: number
	weightingMethods: IDropdownOption[]
	id: string
	isEditing: boolean
}
