/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import styled from 'styled-components'
import { BoxCausalModel } from './BoxCausalModel'
import { useGetArrows } from './arrows'
import { box1, box2, box3, box4 } from './constants'
import { CausalEffectSize } from '~interfaces'

interface ComponentArrowsProps {
	confounders: string[]
	outcomeDeterminants: string[]
	exposure: string
	outcome: string
	size: CausalEffectSize
}
export const ComponentArrows: React.FC<ComponentArrowsProps> = memo(
	function ComponentArrows({
		confounders,
		outcomeDeterminants,
		exposure,
		outcome,
		size,
	}) {
		const getArrows = useGetArrows(size)
		return (
			<Container size={size}>
				<ControlsContainer>
					<ControlsTitle size={size}>Controls</ControlsTitle>
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

				<ControlsContainer>
					<ControlsBoxContainer size={size}>
						<BoxCausalModel
							size={size}
							id={box3.id}
							title="Exposure"
							list={[exposure]}
						/>
						<BoxCausalModel
							size={size}
							id={box4.id}
							title="Outcome"
							list={[outcome]}
						/>
					</ControlsBoxContainer>
				</ControlsContainer>

				{getArrows()}
			</Container>
		)
	},
)

const ControlsTitle = styled.h2<{ size: CausalEffectSize }>`
	margin: unset;
	font-size: ${({ size }) =>
		size === CausalEffectSize.Small ? '15px' : '24px'};
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
`

const ControlsContainer = styled.div`
	grid-column: 1/-1;
	text-align: center;
`

const ControlsBoxContainer = styled.div<{ size: CausalEffectSize }>`
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-column-gap: ${({ size }) =>
		size === CausalEffectSize.Small ? '3em' : '8em'};
	padding: 16px;
`

const DottedContainer = styled(ControlsBoxContainer)`
	border: 1px dotted black;
`
