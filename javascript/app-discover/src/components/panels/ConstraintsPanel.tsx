/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton, Icon, Stack, TooltipHost } from '@fluentui/react'
import { memo } from 'react'
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil'
import styled from 'styled-components'

import type { VariableReference } from '../../domain/CausalVariable.js'
import type { RelationshipReference } from '../../domain/Relationship.js'
import { CausalGraphConstraintsState, TableState } from '../../state/index.js'
import { IconButtonDark } from '../../styles/styles.js'
import { Divider } from '../controls/Divider.js'
import type { ConstraintsPanelProps } from './ConstraintsPanel.types.js'
import { getConstraintIconName } from './ConstraintsPanel.utils.js'

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

		const relationshipConstraints = constraints.manualRelationships.map(
			constraint => (
				<Stack
					horizontal
					verticalAlign="center"
					key={`${constraint.source.columnName}-${constraint.target.columnName}`}
				>
					<Stack.Item
						grow
					>{`${constraint.source.columnName}-${constraint.target.columnName}`}</Stack.Item>
					<Stack.Item>
						<TooltipHost content={constraint.reason}>
							<Icon iconName={getConstraintIconName(constraint)}></Icon>
						</TooltipHost>
						<TooltipHost content="Remove constraint">
							<IconButtonDark
								iconProps={icons.remove}
								onClick={() => removeFromRelationshipConstraints(constraint)}
							/>
						</TooltipHost>
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
					<IconButtonDark
						iconProps={icons.delete}
						onClick={() => removeFromCauseConstraints(constraint)}
					/>
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
			<Stack horizontal key={constraint.columnName} verticalAlign="center">
				<Stack.Item grow>{constraint.columnName}</Stack.Item>
				<Stack.Item>
					<IconButtonDark
						iconProps={icons.delete}
						onClick={() => removeFromEffectConstraints(constraint)}
					/>
				</Stack.Item>
			</Stack>
		))

		const hasAnyConstraints =
			dataTable !== undefined &&
			dataTable?.numCols() !== 0 &&
			(relationshipConstraints.length > 0 ||
				causeConstraints.length > 0 ||
				effectConstraints.length > 0)

		return hasAnyConstraints ? (
			<Container>
				{children}
				{causeConstraints.length > 0 && <Divider>Cause Constraints</Divider>}
				{causeConstraints}
				{effectConstraints.length > 0 && <Divider>Effect Constraints</Divider>}
				{effectConstraints}
				{relationshipConstraints.length > 0 && (
					<Divider>Edge Constraints</Divider>
				)}
				{relationshipConstraints}
				<Divider></Divider>
				<ClearConstraintsButton onClick={resetConstraints}>
					Clear all constraints
				</ClearConstraintsButton>
			</Container>
		) : null
	},
)

const icons = {
	delete: { iconName: 'Delete' },
	remove: { iconName: 'StatusCircleErrorX' },
	switch: { iconName: 'Switch' },
	pinned: { iconName: 'PinSolid12' },
}

const Container = styled.div`
	padding: 8px;
`

const ClearConstraintsButton = styled(DefaultButton)`
	width: 100%;
`
