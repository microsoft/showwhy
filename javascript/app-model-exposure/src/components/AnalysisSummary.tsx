/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FC } from 'react'
import { memo } from 'react'
import styled from 'styled-components'

import type { Estimator } from '../types/estimators/Estimator.js'
import type { AlternativeModels } from '../types/experiments/AlternativeModels.js'
import type { Definition } from '../types/experiments/Definition.js'
import { DefinitionType } from '../types/experiments/DefinitionType.js'
import type { RefutationOption } from '../types/refutation/RefutationOption.js'
import { getDefinitionsByType } from '../utils/definition.js'
import { pluralize } from '../utils/lang.js'
import { Title } from './styles.js'

export const AnalysisSummary: FC<{
	definitions: Definition[]
	alternativeModels: AlternativeModels
	refutationOptions: RefutationOption[]
	estimators: Estimator[]
	activeEstimatedEffects: number[]
}> = memo(function AnalysisSummary({
	definitions,
	alternativeModels,
	refutationOptions,
	estimators,
	activeEstimatedEffects,
}) {
	const populationDefinitions = getDefinitionsByType(
		DefinitionType.Population,
		definitions,
	)
	const exposureDefinitions = getDefinitionsByType(
		DefinitionType.Exposure,
		definitions,
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
