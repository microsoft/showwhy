/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import { Else, If, Then } from 'react-if'
import styled from 'styled-components'

import { CausalDiscoveryAlgorithm } from '../../domain/CausalDiscovery/CausalDiscoveryAlgorithm.js'
import { ContainerEdge, edgeColors, Grid } from './CausalGraphLegend.styles.js'
import { CorrelationIcon, EdgeIcon } from './LegendIcons.js'

export const CausalGraphLegend: React.FC<{
	selectedAlgorithm: CausalDiscoveryAlgorithm
}> = memo(function CausalGraphLegend({ selectedAlgorithm }) {
	const isPCAlgorithm = selectedAlgorithm === CausalDiscoveryAlgorithm.PC
	return (
		<Grid>
			<Container>
				<CorrelationIcon color={edgeColors.correlation} /> Correlation
			</Container>
			<If condition={!isPCAlgorithm}>
				<Then>
					<Container>
						<EdgeIcon color={edgeColors.positive} /> Causes increase
					</Container>
					<Container>
						<EdgeIcon color={edgeColors.negative} /> Causes decrease
					</Container>
				</Then>
				<Else>
					<Container>
						<EdgeIcon color={edgeColors.pcChange} /> Causes change
					</Container>
				</Else>
			</If>
			<ContainerEdge>
				Edge weights quantify the strength of the causal relationship under the
				selected discovery algorithm. corr=correlation;{' '}
				{!isPCAlgorithm ? 'conf=confidence' : ''}
			</ContainerEdge>
		</Grid>
	)
})

const Container = styled.div``
