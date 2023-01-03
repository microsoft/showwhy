/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Link, Spinner, SpinnerSize, Text } from '@fluentui/react'
import { memo, useMemo, useState } from 'react'
import styled from 'styled-components'

import { useShowPlaceboGraphs } from '../../hooks/useShowPlaceboGraphs.js'
import { useTreatedUnitsValueState } from '../../state/index.js'
import { Container, GraphTitle } from '../../styles/index.js'
import type { HoverInfo, TooltipInfo } from '../../types.js'
import { CustomMessageBar } from '../CustomMessageBar.js'
import { PlaceboResult } from './PlaceboResult.js'
import type { PlaceboResultPaneProps } from './PlaceboResultPane.types.js'

export const PlaceboResultPane: React.FC<PlaceboResultPaneProps> = memo(
	function PlaceboResultPane({
		inputData,
		statusMessage,
		isLoading,
		placeboDataGroup,
		placeboOutputData,
		checkableUnits,
		onRemoveCheckedUnit,
	}) {
		const [hoverItem, setHoverItem] = useState<null | TooltipInfo>(null)
		const treatedUnits = useTreatedUnitsValueState()
		const showPlaceboGraphs = useShowPlaceboGraphs()
		const showPlaceboGraphsLocal = useMemo(
			(): boolean => !isLoading && showPlaceboGraphs,
			[isLoading, showPlaceboGraphs],
		)
		const hoverInfo = useMemo(
			() => ({ hoverItem, setHoverItem } as HoverInfo),
			[hoverItem, setHoverItem],
		)

		const placeboResults = useMemo((): JSX.Element[] => {
			return treatedUnits.map((treatedUnit: string) => (
				<PlaceboResult
					key={treatedUnit}
					treatedUnit={treatedUnit}
					hoverInfo={hoverInfo}
					inputData={inputData}
					placeboDataGroup={placeboDataGroup}
					placeboOutputData={placeboOutputData}
					checkableUnits={checkableUnits}
					onRemoveCheckedUnit={onRemoveCheckedUnit}
				/>
			))
		}, [
			checkableUnits,
			hoverInfo,
			inputData,
			onRemoveCheckedUnit,
			placeboDataGroup,
			placeboOutputData,
			treatedUnits,
		])

		return (
			<Pane>
				<Container>
					{statusMessage.isVisible && (
						<CustomMessageBar
							content={statusMessage.content}
							type={statusMessage.type}
						/>
					)}
				</Container>

				<Container>
					{isLoading && <Spinner size={SpinnerSize.medium} />}
				</Container>

				<Container>
					<GraphTitle>Placebo analysis</GraphTitle>
				</Container>

				<Container>
					<Text className="infoText" variant="medium">
						The following visualization shows the trajectory of each unit under
						the placebo assumption that it was treated in the specified period
						(with actual treated units highlighted). Note that each line shows
						the difference in outcomes between the labelled unit and its control
						group.
					</Text>
				</Container>
				{showPlaceboGraphsLocal && placeboResults}
				<Container>
					<Text variant="medium" block>
						Analysis approach based on Abadie, A., Diamond, A. & Hainmueller, J.
						Synthetic Control Methods for Comparative Case Studies:{' '}
						<Link
							href="https://doi.org/10.1198/jasa.2009.ap08746"
							target="_blank"
						>
							Estimating the Effect of California’s Tobacco Control Program
						</Link>
						. Journal of the American Statistical Association 105 (490), 493–505
						(2010). Learn more in{' '}
						<Link
							href="https://mixtape.scunning.com/10-synthetic_control#californias-proposition-99"
							target="_blank"
						>
							Causal Inference: The Mixtape by Scott Cunningham
						</Link>
						.
					</Text>
				</Container>
			</Pane>
		)
	},
)

const Pane = styled.section`
	margin-bottom: 2rem;
	display: flex;
	flex-direction: column;
	gap: 1rem;
`
