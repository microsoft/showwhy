/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDropdownOption } from '@fluentui/react'
import {
	Checkbox,
	DefaultButton,
	Dropdown,
	FontIcon,
	Pivot,
	PivotItem,
	useTheme,
} from '@fluentui/react'
import React, { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'

import { TreatmentSelector } from '../../../components/TreatmentSelector/index.js'
import { useUpdateColumnMapping } from '../../../hooks/useUpdateColumnMapping.js'
import { useUpdateTreatmentsForAgg } from '../../../hooks/useUpdateTreatmentsForAgg.js'
import {
	useAggregateEnabledState,
	useColumnMappingValueState,
	useTreatedUnitsValueState,
} from '../../../state/index.js'
import { StepDescription, StepTitle } from '../../../styles/index.js'
import type { ProcessedInputData, Treatment } from '../../../types.js'
import { SectionContainer } from '../PrepareAnalysis.styles.js'

interface TreatedUnitsProps {
	data: ProcessedInputData
	options: IDropdownOption[]
	defaultTreatment: Treatment | null
	updateTreatmentsForAggregation: (treatment: Treatment) => void
}

export const TreatedUnits: React.FC<TreatedUnitsProps> = memo(
	function TreatedUnits({
		data,
		options,
		defaultTreatment,
		updateTreatmentsForAggregation,
	}) {
		const columnMapping = useColumnMappingValueState()
		const treatedUnits = useTreatedUnitsValueState()
		const [aggregateEnabled, setAggregateEnabled] = useAggregateEnabledState()
		const updateColumnMapping = useUpdateColumnMapping()
		const pivotStyles = usePivotStyles()

		const updateTreatmentsForAgg = useUpdateTreatmentsForAgg(
			defaultTreatment,
			updateTreatmentsForAggregation,
		)

		const handleAggregateOption = useCallback(() => {
			const enabled = !aggregateEnabled
			updateTreatmentsForAgg()
			setAggregateEnabled(enabled)
		}, [aggregateEnabled, setAggregateEnabled, updateTreatmentsForAgg])

		const enableRegroupButton = useMemo(() => {
			const nonGroupedUnits = treatedUnits.filter(
				unit => !unit.startsWith('Group_'),
			)
			return aggregateEnabled && nonGroupedUnits.length > 0
		}, [aggregateEnabled, treatedUnits])

		return (
			<SectionContainer>
				<StepTitle>Define treated units and time periods</StepTitle>
				<StepDescription>
					Select some units and time-periods to consider as treated.
					Alternatively, if your dataset contains a column specifying a
					treatment, select the column to automatically create treatments.
				</StepDescription>
				<Pivot linkFormat="tabs" styles={pivotStyles}>
					<PivotItem headerText="Add treated unit">
						<TreatmentWrapper>
							<TreatmentOptionsWrapper>
								<Checkbox
									label="Aggregate Treated Units"
									checked={aggregateEnabled}
									onChange={handleAggregateOption}
								/>
								<DefaultButton
									text="Regroup"
									onClick={updateTreatmentsForAgg}
									disabled={!enableRegroupButton}
								/>
							</TreatmentOptionsWrapper>
							<TreatmentSelector data={data} />
						</TreatmentWrapper>
					</PivotItem>
					<PivotItem headerText="Automatically create treatments from column">
						<DropdownContainer>
							<Dropdown
								placeholder="Select treated column"
								options={options}
								selectedKey={columnMapping.treated}
								onChange={(e, val) =>
									updateColumnMapping({
										treated: !val ? '' : String(val.key),
									})
								}
							/>
							<FontIcon
								iconName="Cancel"
								className="attributeClearSelection"
								onClick={() => {
									updateColumnMapping({ treated: '' })
								}}
							/>
						</DropdownContainer>
					</PivotItem>
				</Pivot>
			</SectionContainer>
		)
	},
)

const DropdownContainer = styled.div`
	display: grid;
	grid-template-columns: 95% 5%;
	gap: 0.5rem;
	align-items: center;
`

const TreatmentWrapper = styled.div``

const TreatmentOptionsWrapper = styled.div`
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
	margin-bottom: 0.5rem;
`

function usePivotStyles() {
	const theme = useTheme()

	return useMemo(
		() => ({
			root: {
				marginTop: '1rem',
			},
			itemContainer: {
				padding: '0.5rem',
				borderBottom: `1px solid ${theme.palette.neutralTertiaryAlt}`,
			},
		}),
		[theme],
	)
}
