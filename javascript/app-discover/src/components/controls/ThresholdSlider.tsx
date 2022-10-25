/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Slider, Text } from '@fluentui/react'
import { memo } from 'react'
import { useRecoilState } from 'recoil'
import styled from 'styled-components'

import type { ThresholdSliderProps } from './ThresholdSlider.types.js'

export const ThresholdSlider: React.FC<ThresholdSliderProps> = memo(
	function ThresholdSlider({ label, width, thresholdState }) {
		const [threshold, setThreshold] = useRecoilState(thresholdState)

		return (
			<Container style={{ width: width ?? '100%' }}>
				<Text variant="xSmall">{label}</Text>
				<Slider
					max={1.0}
					value={threshold}
					step={0.01}
					styles={{
						valueLabel: { fontSize: 10, marginRight: 0, width: 32 },
						slideBox: { padding: 0, flex: 1 },
					}}
					onChange={setThreshold}
				/>
			</Container>
		)
	},
)

const Container = styled.div`
	display: flex;
	flex-direction: column;
	justifycontent: center;
	alignitems: center;
	aligncontent: center;
`
