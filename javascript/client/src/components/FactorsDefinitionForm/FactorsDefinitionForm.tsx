/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IComboBoxOption } from '@fluentui/react'
import type {
	CausalFactor,
	Experiment,
	Maybe,
	OptionalId,
} from '@showwhy/types'
import { memo } from 'react'
import styled from 'styled-components'

import type { PageType } from '~types'

import { useFactorsDefinitionForm } from './hooks'

export const FactorsDefinitionForm: React.FC<{
	factor?: CausalFactor
	showLevel?: Maybe<boolean>
	defineQuestion?: Experiment
	pageType: PageType
	variables?: IComboBoxOption[]
	onAdd?: (factor: OptionalId<CausalFactor>) => void
	onChange?: (f: Partial<CausalFactor>) => void
}> = memo(function FactorsDefinitionForm({
	factor,
	defineQuestion,
	onAdd,
	onChange,
	showLevel = true,
	pageType,
	variables,
}) {
	const { level, description, variable } = useFactorsDefinitionForm({
		factor,
		experiment: defineQuestion,
		onChange,
		onAdd,
		pageType,
		variables,
	})

	return (
		<Container showLevel={!!showLevel} data-pw="factors-form">
			{showLevel ? <div data-pw="factors-form-is-primary">{level}</div> : null}
			{variable}
			{description}
		</Container>
	)
})

const Container = styled.form<{ showLevel: Maybe<boolean> }>`
	display: grid;
	grid-template-columns: ${({ showLevel }) =>
		showLevel ? '15% 25% 60%' : '30% 70%'};
	align-items: center;
	padding: 0.5rem 0.2rem;
	border-radius: 0 0 3px 3px;
	background-color: #f1f1f1;
	margin-top: 0.1rem;
`
