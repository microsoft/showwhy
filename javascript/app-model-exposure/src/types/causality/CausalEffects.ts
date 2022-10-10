/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export interface CausalEffectsProps {
	confounders: string[]
	outcomeDeterminants: string[]
	exposureDeterminants: string[]
	generalExposure: string
	generalOutcome: string
}
