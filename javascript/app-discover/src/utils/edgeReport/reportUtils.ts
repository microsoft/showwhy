/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { VariableNature } from '../../domain/VariableNature.js'

export function getCausalRelationship(weight = 0) {
	return weight > 0 ? 'increases' : 'decreases'
}

export function isCategorical(nature?: VariableNature): boolean {
	return (
		nature === VariableNature.CategoricalNominal ||
		nature === VariableNature.CategoricalOrdinal
	)
}
