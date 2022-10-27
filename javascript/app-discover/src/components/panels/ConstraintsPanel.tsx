/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton, Label } from '@fluentui/react'
import { memo } from 'react'
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil'
import styled from 'styled-components'

import type { RelationshipReference } from '../../domain/Relationship.js'
import { ManualRelationshipReason } from '../../domain/Relationship.js'
import { CausalGraphConstraintsState, TableState } from '../../state/index.js'
import { Divider } from '../controls/Divider.js'
import { Constraint } from './Constraint.js'
import type { ConstraintsPanelProps } from './ConstraintsPanel.types.js'

export const ConstraintsPanel: React.FC<ConstraintsPanelProps> = memo(
	function ConstraintsPanel({ children }) {
		const [constraints, setConstraints] = useRecoilState(
			CausalGraphConstraintsState,
		)
		const dataTable = useRecoilValue(TableState)

		const resetConstraints = useResetRecoilState(CausalGraphConstraintsState)

		const removeFromRelationshipConstraints = (
			relationshipToRemove: RelationshipReference,
		) => {
			const newConstraints = {
				...constraints,
				manualRelationships: constraints.manualRelationships.filter(
					relationship => relationship !== relationshipToRemove,
				),
			}
			setConstraints(newConstraints)
		}

		const savedConstraints = constraints.manualRelationships
			.filter(x => x.reason === ManualRelationshipReason.Flipped)
			.map(constraint => (
				<Constraint
					key={constraint.key}
					constraint={constraint}
					onRemove={removeFromRelationshipConstraints}
				/>
			))

		const removedConstraints = constraints.manualRelationships
			.filter(x => x.reason === ManualRelationshipReason.Removed)
			.map(constraint => (
				<Constraint
					key={constraint.key}
					constraint={constraint}
					onRemove={removeFromRelationshipConstraints}
				/>
			))

		const hasAnyConstraints =
			dataTable !== undefined &&
			dataTable?.numCols() !== 0 &&
			(!!savedConstraints.length || !!removedConstraints.length)

		return hasAnyConstraints ? (
			<Container>
				<Divider></Divider>
				{children}
				{(!!savedConstraints.length || !!removedConstraints.length) && (
					<Divider>Edge constraints</Divider>
				)}
				{!!savedConstraints.length && <Label>Saved relationships</Label>}
				{savedConstraints}
				{!!removedConstraints.length && <Label>Rejected relationships</Label>}
				{removedConstraints}
				<Divider></Divider>
				<ClearConstraintsButton onClick={resetConstraints}>
					Clear all constraints
				</ClearConstraintsButton>
			</Container>
		) : null
	},
)

const Container = styled.div`
	padding: 8px;
`

const ClearConstraintsButton = styled(DefaultButton)`
	width: 100%;
`
