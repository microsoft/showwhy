/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import styled from 'styled-components'
import { Size } from '~enums'
import { Text } from '~styles'

interface BoxProps {
	id: string
	title?: string
	list?: string[]
	size: Size
	width?: number
}

export const BoxCausalModel: React.FC<BoxProps> = memo(function BoxCausalModel({
	id,
	children,
	title,
	size,
	list,
	width = 90,
}) {
	return (
		<Box id={id} size={size} width={width}>
			<Title>{title}</Title>

			<Content>
				{!!children
					? children
					: list?.length
					? list?.map(item => <Text key={item}>{item}</Text>)
					: null}
			</Content>
		</Box>
	)
})

const Content = styled.div`
	display: flex;
	flex-direction: column;
`
const Title = styled.h4`
	margin: unset;
`

const Box = styled.div<{ size: Size; width: number }>`
	justify-self: center;
	font-size: ${({ size }) => (size === Size.Small ? '12px' : '14px')};
	border: 1px ${({ theme }) => theme.application().border} solid;
	position: relative;
	border-radius: 5px;
	overflow: auto;
	text-align: center;
	padding: 8px;
	color: black;
	width: ${({ width }) => width}%;
`
