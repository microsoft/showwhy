/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FontIcon, Label, TooltipHost } from '@fluentui/react'
import React, { memo } from 'react'
import styled from 'styled-components'

import { RangeFilter } from '../../../components/RangeFilter.js'
import { useFilterValueState } from '../../../state/index.js'
import {
	Container,
	StepDescription,
	StepTitle,
	tooltipHostStyles,
} from '../../../styles/index.js'
import {
	useFilterDataHandler,
	useResetDataHandler,
} from '../EstimateEffects.hooks.js'

interface FilterDataProps {
	isDataLoaded: boolean
	globalDateRange: { startDate: number; endDate: number }
}

export const FilterData: React.FC<FilterDataProps> = memo(function FilterData({
	isDataLoaded,
	globalDateRange,
}) {
	const filter = useFilterValueState()
	const filterDataHandler = useFilterDataHandler(isDataLoaded)
	const resetDataHandler = useResetDataHandler(isDataLoaded)
	return (
		<Container>
			<Label>
				<StepTitle>Filter data</StepTitle>
				<TooltipHost
					content="Use the Start/End dates to customize and filter the data range"
					id="filterDataTooltipId"
					styles={tooltipHostStyles}
				>
					<InfoIcon iconName="Info" aria-describedby="filterDataTooltipId" />
				</TooltipHost>
			</Label>
			<StepDescription>
				Constrain the time before and after the event used to calculate the
				causal effect
			</StepDescription>
			<RangeFilter
				defaultRange={filter && [filter.startDate, filter.endDate]}
				labelStart="Start date"
				labelEnd="End date"
				min={globalDateRange.startDate}
				max={globalDateRange.endDate}
				step={1}
				onApply={filterDataHandler}
				onReset={resetDataHandler}
			/>
		</Container>
	)
})

const InfoIcon = styled(FontIcon)`
	&:hover {
		cursor: pointer;
	}
`
