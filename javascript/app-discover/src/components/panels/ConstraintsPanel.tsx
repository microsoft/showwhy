/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton, Label } from '@fluentui/react'
import { memo } from 'react'
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil'
import styled from 'styled-components'

import type { VariableReference } from '../../domain/CausalVariable.js'
import type { RelationshipReference } from '../../domain/Relationship.js'
import { CausalGraphConstraintsState, TableState } from '../../state/index.js'
import { Divider } from '../controls/Divider.js'
import {
	getGeneralConstraints,
	getRemovedConstraints,
	getSavedConstraints,
} from './ConstraintsPanel.utils.js'

export const ConstraintsPanel: React.FC = memo(function ConstraintsPanel() {
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

	const savedConstraints = getSavedConstraints(
		constraints,
		removeFromRelationshipConstraints,
	)

	const removedConstraints = getRemovedConstraints(
		constraints,
		removeFromRelationshipConstraints,
	)

	const removeFromCauseConstraints = (variableToRemove: VariableReference) => {
		const newConstraints = {
			...constraints,
			causes: constraints.causes.filter(
				variable => variable !== variableToRemove,
			),
		}
		setConstraints(newConstraints)
	}

	const removeFromEffectConstraints = (variableToRemove: VariableReference) => {
		const newConstraints = {
			...constraints,
			effects: constraints.effects.filter(
				variable => variable !== variableToRemove,
			),
		}
		setConstraints(newConstraints)
	}

	const causeConstraints = getGeneralConstraints(
		constraints.causes,
		removeFromCauseConstraints,
	)
	const effectConstraints = getGeneralConstraints(
		constraints.effects,
		removeFromEffectConstraints,
	)

	const hasAnyConstraints =
		dataTable !== undefined &&
		dataTable?.table?.numCols() !== 0 &&
		(!!savedConstraints.length ||
			!!removedConstraints.length ||
			!!causeConstraints.length ||
			!!effectConstraints.length)

	return hasAnyConstraints ? (
		<Container>
			<Divider />

			{(!!savedConstraints.length || !!removedConstraints.length) && (
				<Divider>Edge constraints</Divider>
			)}
			{!!causeConstraints.length && <Label>Causes</Label>}
			{causeConstraints}
			{!!effectConstraints.length && <Label>Effects</Label>}
			{effectConstraints}
			{!!savedConstraints.length && <Label>Saved</Label>}
			{savedConstraints}
			{!!removedConstraints.length && <Label>Disallowed</Label>}
			{removedConstraints}
			<Divider />
			<ClearConstraintsButton onClick={resetConstraints}>
				Clear all constraints
			</ClearConstraintsButton>
		</Container>
	) : null
})

const Container = styled.div`
	padding: 8px;
`

const ClearConstraintsButton = styled(DefaultButton)`
	width: 100%;
`
