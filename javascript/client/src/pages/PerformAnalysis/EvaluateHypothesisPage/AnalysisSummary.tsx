/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Title } from '@showwhy/components'
import type { Estimator } from '@showwhy/types'
import {
	type AlternativeModels,
	type Experiment,
	type RefutationOption,
	DefinitionType,
} from '@showwhy/types'
import type { FC } from 'react'
import { memo } from 'react'
import styled from 'styled-components'

import { getDefinitionsByType, pluralize } from '~utils'

export const AnalysisSummary: FC<{
	defineQuestion: Experiment
	alternativeModels: AlternativeModels
	refutationOptions: RefutationOption[]
	estimators: Estimator[]
	activeEstimatedEffects: number[]
}> = memo(function AnalysisSummary({
	defineQuestion,
	alternativeModels,
	refutationOptions,
	estimators,
	activeEstimatedEffects,
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
				The model domain includes {alternativeModels.confounders.length}{' '}
				confounder
				{pluralize(alternativeModels.confounders.length)} that may affect both
				exposure and outcome ({alternativeModels.confounders.join(', ')}).
				Causal estimates were computed using {populationDefinitions.length}{' '}
				population definition{pluralize(populationDefinitions.length)} (
				{populationDefinitions.map(x => x.variable).join(', ')}) and{' '}
				{exposureDefinitions.length} exposure definition
				{pluralize(exposureDefinitions.length)} (
				{exposureDefinitions.map(x => x.variable).join(', ')}).{' '}
				{estimators.length} estimator{pluralize(estimators.length)}
				{estimators.length > 1 ? ' were ' : ' was '}
				used ({estimators.map(x => x.type).join(', ')}), with each estimate
				subject to {refutationOptions.length} refutation test
				{pluralize(refutationOptions.length)} (
				{refutationOptions.map(o => o.label).join(', ')}
				). {activeEstimatedEffects.length} estimate
				{pluralize(activeEstimatedEffects.length)}
				{activeEstimatedEffects.length > 1 ? ' were ' : ' was '}
				retained for the final significance test.
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
