/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	type AlternativeModels,
	type Experiment,
	type RefutationOption,
	DefinitionType,
} from '@showwhy/types'
import type { FC } from 'react'
import { memo } from 'react'
import styled from 'styled-components'

import { Title } from '~styles'
import { getDefinitionsByType, pluralize } from '~utils'

export const AnalysisSummary: FC<{
	defineQuestion: Experiment
	alternativeModels: AlternativeModels
	refutationOptions: RefutationOption[]
}> = memo(function AnalysisSummary({
	defineQuestion,
	alternativeModels,
	refutationOptions,
}) {
	const populationDefinitions = getDefinitionsByType(
		DefinitionType.Population,
		defineQuestion?.definitions,
	)
	const exposureDefinitions = getDefinitionsByType(
		DefinitionType.Population,
		defineQuestion?.definitions,
	)

	return (
		<>
			<TitleSummary>Analysis summary</TitleSummary>
			<P>
				The model includes {alternativeModels.confounders.length} confounder
				{pluralize(alternativeModels.confounders.length)} that may affect both
				exposure and outcome ({alternativeModels.confounders.join(', ')}),{' '}
				{refutationOptions.length} refutation test
				{pluralize(refutationOptions.length)} (
				{refutationOptions.map(o => o.label).join(', ')}
				), {populationDefinitions.length} population definition
				{pluralize(populationDefinitions.length)} (
				{populationDefinitions.map(x => x.variable).join(', ')}){' '}
				{alternativeModels.outcomeDeterminants.length > 0 ? ', ' : ' and '}
				{exposureDefinitions.length} exposure definition
				{pluralize(exposureDefinitions.length)} (
				{exposureDefinitions.map(x => x.variable).join(', ')})
				{alternativeModels.outcomeDeterminants.length > 0
					? ` and ${
							alternativeModels.outcomeDeterminants.length
					  } other variables that may affect outcome only (${alternativeModels.outcomeDeterminants.join(
							', ',
					  )})`
					: ''}
				.
			</P>
		</>
	)
})

const P = styled.p`
	margin: unset;
`

const TitleSummary = styled(Title)`
	margin: unset;
	margin-bottom: 5px;
`
