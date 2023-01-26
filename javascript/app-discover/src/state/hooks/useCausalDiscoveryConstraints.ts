/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'

import type { CausalDiscoveryConstraints } from '../../domain/CausalDiscovery/CausalDiscoveryConstraints.js'
import type {
	Relationship,
	RelationshipReference,
} from '../../domain/Relationship.js'
import {
	hasSameReason,
	invertRelationship,
	ManualRelationshipReason,
} from '../../domain/Relationship.js'

export function useCausalDiscoveryConstraints(
	userConstraints: CausalDiscoveryConstraints,
	derivedConstraints: RelationshipReference[],
): CausalDiscoveryConstraints {
	return useMemo(
		() => ({
			...userConstraints,
			manualRelationships: [
				...userConstraints.manualRelationships.map((x) => {
					if (hasSameReason(ManualRelationshipReason.Flipped, x)) {
						return invertRelationship(x)
					}
					return x
				}),
				...derivedConstraints,
			] as Relationship[],
		}),
		[userConstraints, derivedConstraints],
	)
}
