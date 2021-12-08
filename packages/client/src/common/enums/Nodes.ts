/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export enum NodeIds {
	IdentifyEstimand = 'Identify Estimand',
	CreateCausalGraph = 'Create Causal Graph',
	LoadDataset = 'Load Dataset',
	EstimateEffects = 'Estimate Effects',
	SignificanceTest = 'Significance Test',
}

export enum NodeTypes {
	IdentifyEstimand = 'IdentifyEstimandNode',
	CreateCausalGraph = 'CausalGraphNode',
	LoadDataset = 'LoadNode',
	EstimateEffects = 'EstimateEffectNode',
	SignificanceTest = 'SignificanceTestNode',
}

export enum NodeResponseStatus {
	Completed = 'completed',
	Error = 'error',
	Processing = 'processing',
	Pending = 'pending',
	Idle = 'idle',
	Failed = 'failed',
	Running = 'running',
	InProgress = 'in_progress',
	Terminated = 'terminated',
}
