/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	CausalFactor,
	DefinitionType,
	ElementDefinition,
	Experiment,
	Maybe,
	OptionalId,
} from '@showwhy/types'
import { memo } from 'react'
import styled from 'styled-components'

import { useFactorsDefinitionForm } from './hooks'

export const FactorsDefinitionForm: React.FC<{
	factor?: CausalFactor | ElementDefinition
	showLevel?: Maybe<boolean>
	defineQuestion?: Experiment
	definitionType?: DefinitionType
	onAdd?: (factor: OptionalId<CausalFactor | ElementDefinition>) => void
	onChange?: (f: Partial<CausalFactor | ElementDefinition>) => void
}> = memo(function FactorsDefinitionForm({
	factor,
	defineQuestion,
	definitionType,
	onAdd,
	onChange,
	showLevel = true,
}) {
	const { level, description, variable, addButton } = useFactorsDefinitionForm({
		factor,
		experiment: defineQuestion,
		definitionType: definitionType as DefinitionType,
		onChange,
		onAdd,
		showLevel,
	})

	return (
		<Container showLevel={!!showLevel} data-pw="factors-form">
			{showLevel ? <div data-pw="factors-form-is-primary">{level}</div> : null}
			{variable}
			{description}
			{addButton}
		</Container>
	)
})

const Container = styled.form<{ showLevel: Maybe<boolean> }>`
	display: grid;
	grid-template-columns: ${({ showLevel }) =>
		showLevel ? '15% 35% 40% 10%' : '30% 60% 10%'};
	align-items: center;
	padding: 0.5rem 0.2rem;
	border-radius: 0 0 3px 3px;
	background-color: #f1f1f1;
	margin-top: 0.1rem;
`
