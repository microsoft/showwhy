/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { CausalDiscoveryConstraints } from '../../domain/CausalDiscovery/CausalDiscoveryConstraints.js'
import type { VariableReference } from '../../domain/CausalVariable.js'
import type { RelationshipReference } from '../../domain/Relationship.js'
import { ManualRelationshipReason } from '../../domain/Relationship.js'
import { Constraint, GeneralConstraint } from './Constraint.js'

export const getSavedConstraints = (
	constraints: CausalDiscoveryConstraints,
	removeFromRelationshipConstraints: (
		relationship: RelationshipReference,
	) => void,
) =>
	constraints.manualRelationships
		.filter((x) => x.reason === ManualRelationshipReason.Flipped)
		.map((constraint) => (
			<Constraint
				key={constraint.key}
				constraint={constraint}
				onRemove={removeFromRelationshipConstraints}
			/>
		))

export const getRemovedConstraints = (
	constraints: CausalDiscoveryConstraints,
	removeFromRelationshipConstraints: (
		relationship: RelationshipReference,
	) => void,
) =>
	constraints.manualRelationships
		.filter((x) => x.reason === ManualRelationshipReason.Removed)
		.map((constraint) => (
			<Constraint
				key={constraint.key}
				constraint={constraint}
				onRemove={removeFromRelationshipConstraints}
			/>
		))

export const getGeneralConstraints = (
	constraints: VariableReference[],
	removeFromConstraints: (relationship: VariableReference) => void,
) =>
	constraints.map((constraint) => (
		<GeneralConstraint
			key={constraint.columnName}
			constraint={constraint}
			onRemove={removeFromConstraints}
		/>
	))
