/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Estimator } from '../types/estimators/Estimator.js'
import type { Handler, Maybe } from '../types/primitives.js'

export enum BatchUpdateAction {
	Delete = 'delete',
	Add = 'add',
}

export interface EstimatorOption extends Estimator {
	description: string
	onChange: (refutations: string) => void
	checked: boolean
	default: boolean
	onDefaultChange: Maybe<Handler>
}

export interface EstimatorCardOption {
	key: string
	title: string
	description: string
	list: EstimatorOption[]
}
