/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FocusZone, List } from '@fluentui/react'
import { memo, useCallback } from 'react'

import type { Relationship } from '../../domain/Relationship.js'
import { RelationshipItem } from './RelationshipItem.js'
import type { RelationshipListProps } from './RelationshipList.types.js'

export const RelationshipList: React.FC<RelationshipListProps> = memo(
	function RelationshipList({ relationships: correlations, toColumnName }) {
		const onRenderCell = useCallback(
			(item?: Relationship) =>
				item && (
					<RelationshipItem
						key={`${item.source.columnName}-${item.target.columnName}-relationship`}
						relationship={item}
						toColumnName={toColumnName}
					/>
				),
			[toColumnName],
		)

		return (
			<>
				<FocusZone>
					<List
						items={correlations}
						renderedWindowsAhead={1}
						onRenderCell={onRenderCell}
						onShouldVirtualize={() => false} // force all items to be rendered
					/>
				</FocusZone>
			</>
		)
	},
)
