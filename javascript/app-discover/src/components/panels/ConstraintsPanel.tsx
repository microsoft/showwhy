/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton, Stack } from '@fluentui/react'
import { DeleteIcon } from '@fluentui/react-icons-mdl2'
import { memo } from 'react'
import { useRecoilState, useResetRecoilState } from 'recoil'

import type { VariableReference } from '../../domain/CausalVariable.js'
import type { RelationshipReference } from '../../domain/Relationship.js'
import { CausalGraphConstraintsState } from '../../state/index.js'
import { Divider } from '../controls/Divider.js'
import type { ConstraintsPanelProps } from './ConstraintsPanel.types.js'

export const ConstraintsPanel: React.FC<ConstraintsPanelProps> = memo(
	function ConstraintsPanel({ children }) {
		const [constraints, setConstraints] = useRecoilState(
			CausalGraphConstraintsState,
		)
		const resetConstraints = useResetRecoilState(CausalGraphConstraintsState)

		const removeFromRelationshipConstraints = (
			relationshipToRemove: RelationshipReference,
		) => {
			const newConstraints = {
				...constraints,
				forbiddenRelationships: constraints.forbiddenRelationships.filter(
					relationship => relationship !== relationshipToRemove,
				),
			}
			setConstraints(newConstraints)
		}

		const relationshipConstraints = constraints.forbiddenRelationships.map(
			constraint => (
				<Stack
					horizontal
					key={`${constraint.source.columnName}-${constraint.target.columnName}`}
				>
					<Stack.Item
						grow
					>{`${constraint.source.columnName}-${constraint.target.columnName}`}</Stack.Item>
					<Stack.Item>
						<DeleteIcon
							onClick={() => removeFromRelationshipConstraints(constraint)}
						/>
					</Stack.Item>
				</Stack>
			),
		)

		const removeFromCauseConstraints = (
			variableToRemove: VariableReference,
		) => {
			const newConstraints = {
				...constraints,
				causes: constraints.causes.filter(
					variable => variable !== variableToRemove,
				),
			}
			setConstraints(newConstraints)
		}

		const causeConstraints = constraints.causes.map(constraint => (
			<Stack horizontal key={constraint.columnName}>
				<Stack.Item grow>{constraint.columnName}</Stack.Item>
				<Stack.Item>
					<DeleteIcon onClick={() => removeFromCauseConstraints(constraint)} />
				</Stack.Item>
			</Stack>
		))

		const removeFromEffectConstraints = (
			variableToRemove: VariableReference,
		) => {
			const newConstraints = {
				...constraints,
				effects: constraints.effects.filter(
					variable => variable !== variableToRemove,
				),
			}
			setConstraints(newConstraints)
		}

		const effectConstraints = constraints.effects.map(constraint => (
			<Stack horizontal key={constraint.columnName}>
				<Stack.Item grow>{constraint.columnName}</Stack.Item>
				<Stack.Item>
					<DeleteIcon onClick={() => removeFromEffectConstraints(constraint)} />
				</Stack.Item>
			</Stack>
		))
		const hasAnyConstraints =
			relationshipConstraints.length > 0 ||
			causeConstraints.length > 0 ||
			effectConstraints.length > 0
		return (
			<>
				{hasAnyConstraints && children}
				{relationshipConstraints.length > 0 && (
					<Divider>Forbidden Relationships</Divider>
				)}
				{relationshipConstraints}
				{causeConstraints.length > 0 && <Divider>Cause Constraints</Divider>}
				{causeConstraints}
				{effectConstraints.length > 0 && <Divider>Effect Constraints</Divider>}
				{effectConstraints}
				{hasAnyConstraints && (
					<>
						<Divider></Divider>
						<DefaultButton onClick={resetConstraints}>
							Clear all constraints
						</DefaultButton>
					</>
				)}
			</>
		)
	},
)
