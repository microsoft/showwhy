/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export enum GraphNodeType {
	// IdentifyEstimand = 'IdentifyEstimandNode', // TODO: Validate if it's being used
	// CreateCausalGraph = 'CausalGraphNode', // TODO: Validate if it's being used
	LoadDataset = 'LoadNode',
	EstimateEffects = 'EstimateEffectNode',
	SignificanceTest = 'SignificanceTestNode',
}
