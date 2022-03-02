/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export enum GraphNodeType {
	IdentifyEstimand = 'IdentifyEstimandNode',
	CreateCausalGraph = 'CausalGraphNode',
	LoadDataset = 'LoadNode',
	EstimateEffects = 'EstimateEffectNode',
	SignificanceTest = 'SignificanceTestNode',
}
