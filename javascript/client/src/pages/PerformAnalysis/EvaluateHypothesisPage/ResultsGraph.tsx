/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Dimensions } from '@essex/hooks'
import type {
	AlternativeModels,
	Experiment,
	Maybe,
	RefutationOption,
} from '@showwhy/types'
import { DefinitionType } from '@showwhy/types'
import { memo } from 'react'
import styled from 'styled-components'

import { PivotScatterplot } from '~components/PivotScatterplot'
import { Container } from '~styles'
import type {
	DecisionFeature,
	Specification,
	SpecificationCurveConfig,
} from '~types'
import { getDefinitionsByType, pluralize } from '~utils'

export const ResultsGraph: React.FC<{
	specificationData: Specification[]
	defineQuestion: Experiment
	specificationCurveConfig: SpecificationCurveConfig
	vegaWindowDimensions: Dimensions
	onMouseOver: (item: Maybe<Specification | DecisionFeature>) => void
	hovered: Maybe<number>
	failedRefutationIds: number[]
	alternativeModels: AlternativeModels
	refutationOptions: RefutationOption[]
}> = memo(function ResultsGraph({
	specificationData,
	defineQuestion,
	specificationCurveConfig,
	vegaWindowDimensions,
	onMouseOver,
	hovered,
	failedRefutationIds,
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
		<Container>
			<Title>Analysis summary</Title>
			<P>
				The model includes {alternativeModels.confounders.length} confounder
				{pluralize(alternativeModels.confounders.length)} that may affect both
				exposure and outcome ({alternativeModels.confounders.join(', ')}),{' '}
				{refutationOptions.length} refutation test
				{pluralize(refutationOptions.length)} (
				{refutationOptions.map(o => o.label).join(', ')}
				), {populationDefinitions.length}population definition
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
			<PivotScatterplot
				data={specificationData}
				config={specificationCurveConfig}
				width={vegaWindowDimensions.width}
				height={vegaWindowDimensions.height * 0.25}
				onMouseOver={onMouseOver}
				hovered={hovered}
				failedRefutationIds={failedRefutationIds}
			/>
		</Container>
	)
})

const P = styled.p`
	margin-bottom: unset;
`

const Title = styled.h4`
	margin: unset;
`
