/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { RefutationType } from '@showwhy/types'

export function buildRefutationSpecs(refutationType: RefutationType): {
	num_simulations: number
} {
	return {
		num_simulations: getSimulationNumByRefuterType(refutationType),
	}
}

function getSimulationNumByRefuterType(type: RefutationType): number {
	switch (type) {
		case RefutationType.FullRefutation:
			return 100
		case RefutationType.QuickRefutation:
		default:
			return 10
	}
}
