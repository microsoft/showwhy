/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import styled from 'styled-components'

import { useGetArrows } from './arrows.js'
import { BoxCausalModel } from './BoxCausalModel.js'
import {
	box1,
	box2,
	box3,
	box4,
	CausalEffectSize,
} from './CausalEffectsArrows.constants.js'

export const CausalEffectsArrows: React.FC<{
	confounders: string[]
	outcomeDeterminants: string[]
	generalExposure: string
	generalOutcome: string
	size?: CausalEffectSize
}> = memo(function CausalEffectsArrows({
	confounders,
	outcomeDeterminants,
	generalExposure,
	generalOutcome,
	size = CausalEffectSize.Medium,
}) {
	const getArrows = useGetArrows(size)
	return (
		<Container size={size}>
			<ControlsContainer>
				<ControlsTitle>Controls</ControlsTitle>
				<DottedContainer size={size}>
					<BoxCausalModel
						size={size}
						id={box1.id}
						list={confounders}
						title="Confounders"
					/>
					<BoxCausalModel
						size={size}
						id={box2.id}
						list={outcomeDeterminants}
						title="Outcome determinants"
					/>
				</DottedContainer>
			</ControlsContainer>

			<Box>
				<ControlsBoxContainer size={size}>
					<BoxCausalModel
						size={size}
						id={box3.id}
						title="Exposure"
						list={[generalExposure]}
					/>
					<BoxCausalModel
						size={size}
						id={box4.id}
						title="Outcome"
						list={[generalOutcome]}
					/>
				</ControlsBoxContainer>
			</Box>

			{getArrows()}
		</Container>
	)
})

const ControlsTitle = styled.h4`
	margin: unset;
`

const Container = styled.div<{ size: CausalEffectSize }>`
	background: white;
	display: grid;
	grid-template-rows: 2fr 1fr;
	grid-template-columns: 1fr 1fr;
	grid-column-gap: ${({ size }) =>
		size === CausalEffectSize.Small ? '1em' : '5em'};
	grid-row-gap: ${({ size }) =>
		size === CausalEffectSize.Small ? '0em' : '2em'};
	position: relative;
`

const Box = styled.div`
	grid-column: 1/-1;
	text-align: center;
`

const ControlsContainer = styled(Box)`
	border: 1px dotted black;
`

const ControlsBoxContainer = styled.div<{ size: CausalEffectSize }>`
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-column-gap: ${({ size }) =>
		size === CausalEffectSize.Small ? '3em' : '8em'};
	padding: 16px;
`

const DottedContainer = styled(ControlsBoxContainer)``
