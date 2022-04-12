/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IChoiceGroupOption } from '@fluentui/react'
import type { Handler, Maybe } from '@showwhy/types'
import { EstimatorGroup, EstimatorType } from '@showwhy/types'

export const estimatorGroups: IChoiceGroupOption[] = [
	{
		key: EstimatorGroup.Exposure,
		text: EstimatorGroup.Exposure,
	},
	{
		key: EstimatorGroup.Outcome,
		text: EstimatorGroup.Outcome,
	},
]

// Lower value, higher rank
export const estimatorRanking = [
	{
		key: EstimatorType.LinearDoubleMachineLearning,
		value: 1,
	},
	{
		key: EstimatorType.ForestDoubleMachineLearning,
		value: 2,
	},
	{
		key: EstimatorType.LinearDoublyRobustLearner,
		value: 3,
	},
	{
		key: EstimatorType.ForestDoublyRobustLearner,
		value: 4,
	},
	{
		key: EstimatorType.PropensityScoreStratification,
		value: 5,
	},
	{
		key: EstimatorType.InversePropensityWeighting,
		value: 6,
	},
	{
		key: EstimatorType.PropensityScoreMatching,
		value: 7,
	},
	{
		key: EstimatorType.LinearRegression,
		value: 8,
	},
]

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
