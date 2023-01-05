/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDropdownOption } from '@fluentui/react'
import { Dropdown, FontIcon, Stack, Text, TooltipHost } from '@fluentui/react'
import { isEqual } from 'lodash'
import type { FormEvent } from 'react'
import React, { memo, useCallback } from 'react'
import styled from 'styled-components'

import { useUpdateColumnMapping } from '../../../hooks/useUpdateColumnMapping.js'
import {
	useColumnMappingState,
	useSetOutcomeNameState,
	useSetUnitsState,
} from '../../../state/index.js'
import {
	StepDescription,
	StepTitle,
	tooltipHostStyles,
} from '../../../styles/index.js'
import type { ProcessedInputData } from '../../../types.js'
import { SectionContainer } from '../PrepareAnalysis.styles.js'

interface DataColumnsProps {
	data: ProcessedInputData
	options: IDropdownOption[]
}
export const DataColumns: React.FC<DataColumnsProps> = memo(
	function DataColumns({ data, options }) {
		const setUnits = useSetUnitsState()
		const setOutcomeName = useSetOutcomeNameState()
		const [columnMapping, setColumnMapping] = useColumnMappingState()
		const updateColumnMapping = useUpdateColumnMapping()

		const handleOutColumnChange = (
			e: FormEvent<HTMLDivElement>,
			option?: IDropdownOption<string>,
		) => {
			const outCol = '' + (option?.key.toString() ?? '')
			if (outCol !== '') {
				const newMapping = { ...columnMapping, ...{ value: outCol } }
				if (!isEqual(newMapping, columnMapping)) setColumnMapping(newMapping)
				setOutcomeName(prev => (!prev ? outCol : prev))
			}
		}

		const onUnitUpdate = useCallback(
			(value?: IDropdownOption) => {
				const unit = !value ? '' : String(value.key)
				updateColumnMapping({ unit })
				setUnits(prev => (!prev ? unit : prev))
			},
			[setUnits, updateColumnMapping],
		)
		return (
			<SectionContainer>
				<StepTitle>Select time, units, and outcome columns</StepTitle>
				<StepDescription>
					Select data columns representing the time periods (e.g., years) in
					which the units of your analysis (e.g., different regions or groups)
					were observed to have outcomes before and after the treatment/event of
					interest.
				</StepDescription>
				<DropdownContainer>
					<Dropdown
						placeholder="Time"
						label="Time"
						options={options}
						selectedKey={columnMapping.date}
						onChange={(e, val) =>
							updateColumnMapping({
								date: !val ? '' : String(val.key),
							})
						}
					/>
					<Dropdown
						placeholder="Units"
						label="Units"
						options={options}
						selectedKey={columnMapping.unit}
						onChange={(e, val) => onUnitUpdate(val)}
					/>
					<Dropdown
						placeholder="Outcome"
						label="Outcome"
						options={options}
						selectedKey={columnMapping.value}
						onChange={handleOutColumnChange}
					/>
				</DropdownContainer>

				{data.nonBalancedUnits?.length && !!columnMapping.value ? (
					<Stack horizontal tokens={{ childrenGap: 10, padding: 10 }}>
						<Text>
							{data.nonBalancedUnits.length} units missing outcomes have been
							excluded
						</Text>
						<TooltipHost
							content={data.nonBalancedUnits.map((i, key) => (
								<Text
									key={key}
									block
									styles={{ root: { marginBottom: '10px' } }}
								>
									{i}
								</Text>
							))}
							id="nonBalancedUnits"
							styles={tooltipHostStyles}
						>
							<FontIcon
								iconName="Info"
								className="non-balanced-units-icon"
								aria-describedby="nonBalancedUnits"
							/>
						</TooltipHost>
					</Stack>
				) : null}
			</SectionContainer>
		)
	},
)

export const DropdownContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 0.5rem;
	> * {
		min-width: 0;
	}
`
