/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment */
import { performIntervention } from '../api/index.js'

export interface Intervention {
	columnName: string
	value: number
}

export interface InterventionByColumn {
	[columnName: string]: number
}

export interface CausalInferenceResult {
	baseline: Map<string, number>
	intervention: Map<string, number>
}

export async function runCausalInference(
	interventionModelId: string,
	confidenceThreshold: number,
	weightThreshold: number,
	interventions: Intervention[] = [],
): Promise<CausalInferenceResult> {
	const interventionResult = await performIntervention(
		interventionModelId,
		interventions,
		confidenceThreshold,
		weightThreshold,
	)

	return {
		baseline: new Map(Object.entries(interventionResult.baseline)),
		intervention: new Map(Object.entries(interventionResult.intervention)),
	}
}
