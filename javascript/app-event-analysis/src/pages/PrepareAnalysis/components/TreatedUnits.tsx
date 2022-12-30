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
	Label,
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
				{/* TODO: Insert Pivot */}
				{/* <Spacer axis="vertical" size={5} /> */}
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
					{/* <Spacer axis="vertical" size={5} /> */}
					<TreatmentSelector data={data} />
				</TreatmentWrapper>
				<p>OR</p>
				<DropdownContainer>
					<Label>Automatically create treatments from column:</Label>
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
			</SectionContainer>
		)
	},
)

const DropdownContainer = styled.div`
	display: grid;
	grid-template-columns: 60% 35% 5%;
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
