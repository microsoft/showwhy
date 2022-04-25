/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	EstimatorGroup,
	EstimatorType,
	Handler,
	Maybe,
} from '@showwhy/types'

export enum BatchUpdateAction {
	Delete = 'delete',
	Add = 'add',
}

interface EstimatorOption {
	description: string
	onChange: () => void
	isChecked: boolean
	isDefault: boolean
	onDefaultChange: Maybe<Handler>
	group: EstimatorGroup
	type: EstimatorType
}

export interface EstimatorCardOption {
	key: string
	title: string
	description: string
	onCardClick: Handler
	isCardChecked: boolean
	list: EstimatorOption[]
}
