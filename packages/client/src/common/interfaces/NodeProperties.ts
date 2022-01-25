/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { RefutationType } from '../enums/RefutationType'
import { AlternativeModels } from './AlternativeModels'
import { DescribeElements } from './DescribeElements'
import { Estimator } from './Estimator'

export interface NodeProperties {
	fileName?: string
	definitions: DescribeElements
	estimators: Estimator[]
	refutationType: RefutationType
	confidenceInterval: boolean
	maximumLevel: AlternativeModels
	minimumModel: AlternativeModels
	intermediateLevel: AlternativeModels
	unadjustedModel: AlternativeModels
}
