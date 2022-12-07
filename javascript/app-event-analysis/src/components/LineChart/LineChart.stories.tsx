/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ComponentStory } from '@storybook/react'
import { RecoilRoot } from 'recoil'

import { LineChart } from './LineChart.js'
import { args } from './LineChart.stories.data.js'
import type { LineChartProps } from './LineChart.types.js'

const meta = {
	title: '@showwhy:app-event-analysis/LineChart',
	component: LineChart,
	args,
}
export default meta
const Template: ComponentStory<typeof LineChart> = (args: LineChartProps) => {
	return (
		<RecoilRoot>
			<LineChart {...args} />
		</RecoilRoot>
	)
}

export const LineChartStory = Template.bind({})
LineChart.storyName = 'Line Chart'
