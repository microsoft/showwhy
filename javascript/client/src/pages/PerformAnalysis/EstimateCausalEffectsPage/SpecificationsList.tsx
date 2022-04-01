/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	ElementDefinition,
	Estimator,
	Maybe,
	RefutationOption,
} from '@showwhy/types'
import { DefinitionType } from '@showwhy/types'
import { memo } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { RefutationOptionsCallout } from '~components/RefutationOptionsCallout'
import { Bold, Container, Text, Title } from '~styles'
import { getDefinitionsByType, pluralize } from '~utils'

interface SpecificationsListProp {
	estimators: Estimator[]
	definitions: Maybe<ElementDefinition[]>
	hasConfidenceInterval: boolean
	refutationOptions: RefutationOption[]
}

const causalModels = ['Maximum', 'Minimum']
export const SpecificationsList: React.FC<SpecificationsListProp> = memo(
	function SpecificationsList({
		estimators,
		definitions = [],
		hasConfidenceInterval,
		refutationOptions,
	}) {
		const totalEstimatorsCount = estimators.length
		const population = getDefinitionsByType(
			DefinitionType.Population,
			definitions,
		).length
		const exposure = getDefinitionsByType(
			DefinitionType.Exposure,
			definitions,
		).length
		const outcome = getDefinitionsByType(
			DefinitionType.Outcome,
			definitions,
		).length

		return (
			<Container>
				<Title>Analysis specifications as combinations of: ​​</Title>

				<List>
					<ListItem data-pw="specification-population">
						{population ? (
							<Text>
								<Bold>{population}</Bold> population definition
								{pluralize(population)}
							</Text>
						) : (
							<Link to="/define/population">Define population</Link>
						)}
						​
					</ListItem>
					<ListItem data-pw="specification-exposure">
						{exposure ? (
							<Text>
								<Bold>{exposure}</Bold> exposure definition
								{pluralize(exposure)}
							</Text>
						) : (
							<Link to="/define/exposure">Define exposure</Link>
						)}
						​
					</ListItem>
					<ListItem data-pw="specification-outcome">
						{outcome ? (
							<Text>
								<Bold>{outcome}</Bold> outcome definition
								{pluralize(outcome)}
							</Text>
						) : (
							<Link to="/define/outcome">Define outcome</Link>
						)}
						​
					</ListItem>
					<ListItem data-pw="specification-causal-models">
						<Bold>{causalModels.length + 1}</Bold> causal models​
					</ListItem>
					<ListItem data-pw="specification-estimators">
						<Bold>{totalEstimatorsCount}</Bold> estimator configuration
						{pluralize(totalEstimatorsCount)}
					</ListItem>
				</List>
				<span>For each specification, compute:</span>
				<List>
					<ListItem>Estimated effect</ListItem>
					{hasConfidenceInterval && <ListItem>Confidence interval</ListItem>}
					<ListItem>
						{refutationOptions.length} refutation tests:{' '}
						{refutationOptions.map((o, index) => (
							<RefutationOptionsCallout
								key={index}
								calloutKey={index}
								title={o.label}
								text={o.helpText}
								separate={index > 0}
							/>
						))}
					</ListItem>
				</List>
			</Container>
		)
	},
)

const List = styled.ul``

const ListItem = styled.li`
	padding: 0.5rem;
`
