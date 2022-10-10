/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	ClearIcon,
	FavoriteStarFillIcon,
	RevToggleKeyIcon,
} from '@fluentui/react-icons-mdl2'
import { memo } from 'react'

import { Divider } from './controls/Divider.js'
import type { GraphDifferenceListProps } from './GraphChanges.types.js'
import { CausalVariableList } from './lists/CausalVariableList.js'
import { RelationshipList } from './lists/RelationshipList.js'

export const GraphDifferenceList: React.FC<GraphDifferenceListProps> = memo(
	function GraphDifferentList({ differences }) {
		const modifiedRelationships = differences.modifiedRelationships.map(
			relationshipMod => relationshipMod.difference,
		)
		return (
			<>
				<Divider>Added Variables</Divider>
				<CausalVariableList variables={differences.addedVariables} />
				<Divider>Removed Variables</Divider>
				<CausalVariableList variables={differences.removedVariables} />
				<Divider>
					<FavoriteStarFillIcon /> Added Relationships
				</Divider>
				<RelationshipList relationships={differences.addedRelationships} />
				<Divider>
					<ClearIcon /> Removed Relationships
				</Divider>
				<RelationshipList relationships={differences.removedRelationships} />
				<Divider>
					<RevToggleKeyIcon /> Reversed Relationships
				</Divider>
				<RelationshipList relationships={differences.reversedRelationships} />
				<Divider>Modified Relationships</Divider>
				<RelationshipList relationships={modifiedRelationships} />
			</>
		)
	},
)
