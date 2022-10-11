/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Slider, Text } from '@fluentui/react'
import { memo } from 'react'
import styled from 'styled-components'

import type { ThresholdSliderProps } from './ThresholdSlider.types.js'

export const ThresholdSlider: React.FC<ThresholdSliderProps> = memo(
	function ThresholdSlider({ label, width, value, setValue }) {
		return (
			<Container style={{ width: width ?? '100%' }}>
				<Text variant="small">{label}</Text>
				<Slider
					max={1.0}
					value={value}
					step={0.01}
					styles={SLIDER_STYLE}
					onChange={setValue}
				/>
			</Container>
		)
	},
)

const SLIDER_STYLE = {
	valueLabel: { fontSize: '8pt' },
	slideBox: { padding: 0, flex: 1 },
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
`
