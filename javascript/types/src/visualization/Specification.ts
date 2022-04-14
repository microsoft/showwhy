/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { RefutationResult } from '@showwhy/types'

export interface Specification {
	id: number
	population: string
	treatment: string
	outcome: string
	causalModel: string
	estimator: string
	/**
	 * This is a "JSON" payload of the python config params, but contains non-JSON-compatible
	 * pythonisms (e.g., function calls). We'll just leave it a string for display.
	 */
	estimatorConfig: string
	estimatedEffect: number
	causalModelSHAP: number
	estimatorSHAP: number
	populationSHAP: number
	treatmentSHAP: number
	refuterPlaceboTreatment: number | null
	refuterDataSubset: number | null
	refuterRandomCommonCause: number | null
	refuterBootstrap: number | null
	populationSize: number
	populationType: string
	treatmentType: string
	outcomeType: string
	taskId: string
	/**
	 * 95% Confidence interval
	 */
	c95Upper: number | null
	c95Lower: number | null
	/**
	 * Refutation Result:
	 * 	Not completed = -1,
	 *	Failed critical = 0,
	 *	Failed non critical = 1,
	 *	Passed all = 2,
	 */
	refutationResult: RefutationResult
}
