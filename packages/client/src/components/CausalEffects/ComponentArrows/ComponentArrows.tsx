/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import styled from 'styled-components'
import { BoxCausalModel } from './BoxCausalModel'
import { useGetArrows } from './arrows'
import { box1, box2, box3, box4 } from './constants'
import { Size } from '~enums'

interface ComponentArrowsProps {
	confounders: string[]
	outcomeDeterminants: string[]
	exposure: string
	outcome: string
	size: Size
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
					<ControlsBoxContainer size={size}>
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
					</ControlsBoxContainer>
				</ControlsContainer>
				<BoxCausalModel
					size={size}
					id={box3.id}
					title="Exposure"
					list={[exposure]}
					width={50}
				/>
				<BoxCausalModel
					size={size}
					id={box4.id}
					title="Outcome"
					list={[outcome]}
					width={50}
				/>
				{getArrows()}
			</Container>
		)
	},
)

const ControlsTitle = styled.h2<{ size: Size }>`
	margin: unset;
	font-size: ${({ size }) => (size === Size.Small ? '15px' : '24px')};
`

const Container = styled.div<{ size: Size }>`
	background: white;
	display: grid;
	grid-template-rows: 3fr 1fr;
	grid-template-columns: 1fr 1fr;
	grid-column-gap: ${({ size }) => (size === Size.Small ? '1em' : '5em')};
	grid-row-gap: ${({ size }) => (size === Size.Small ? '2em' : '5em')};
`

const ControlsContainer = styled.div`
	grid-column: 1/-1;
	text-align: center;
`

const ControlsBoxContainer = styled.div<{ size: Size }>`
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-column-gap: ${({ size }) => (size === Size.Small ? '3em' : '8em')};
	border: 1px dotted black;
	padding: 16px;
`
