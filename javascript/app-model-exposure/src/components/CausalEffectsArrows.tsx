/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'

import {
	box1,
	box2,
	box3,
	box4,
	CausalEffectSize,
} from './CausalEffectsArrows.constants.js'
import { useGetArrows } from './CausalEffectsArrows.hooks.js'
import {
	Box,
	CausalBox,
	Container,
	Content,
	ControlsBoxContainer,
	ControlsContainer,
	ControlsTitle,
	DottedContainer,
	Title,
} from './CausalEffectsArrows.styles.js'
import { Text } from './styles.js'

export const CausalEffectsArrows: React.FC<{
	confounders: string[]
	outcomeDeterminants: string[]
	generalExposure: string
	generalOutcome: string
	width: number
	size?: CausalEffectSize
}> = memo(function CausalEffectsArrows({
	confounders,
	outcomeDeterminants,
	generalExposure,
	generalOutcome,
	width,
	size = CausalEffectSize.Medium,
}) {
	const getArrows = useGetArrows(size, width)
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

const BoxCausalModel: React.FC<{
	id: string
	children?: React.ReactNode
	title?: string
	list?: string[]
	size: CausalEffectSize
	width?: number
}> = memo(function BoxCausalModel({
	id,
	children,
	title,
	size,
	list,
	width = 90,
}) {
	return (
		<CausalBox id={id} size={size} width={width}>
			<Title>{title}</Title>

			<Content>
				{children
					? children
					: list?.length
					? list?.map(item => <Text key={item}>{item}</Text>)
					: null}
			</Content>
		</CausalBox>
	)
})
