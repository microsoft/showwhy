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
	function ThresholdSlider({ label, width, thresholdState, defaultStyling }) {
		const [threshold, setThreshold] = useRecoilState(thresholdState)

		return (
			<Container style={{ width: width ?? '100%' }}>
				{!defaultStyling ? <Text variant="xSmall">{label}</Text> : null}
				<Slider
					label={defaultStyling ? label : undefined}
					max={1.0}
					value={threshold}
					step={0.01}
					styles={
						!defaultStyling
							? {
									valueLabel: { fontSize: 10, marginRight: 0, width: 32 },
									slideBox: { padding: 0, flex: 1 },
							  }
							: undefined
					}
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
