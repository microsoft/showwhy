/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { PrimaryButton, Spinner, SpinnerSize, Stack } from '@fluentui/react'
import React, { memo, useState } from 'react'

import { PlaceboResultPane } from '../../components/PlaceboResultPane/index.js'
import { useCalculateEstimate } from '../../hooks/useCalculateEstimate.js'
import { useCannotCalculatePlacebo } from '../../hooks/useCannotCalculatePlacebo.js'
import { useUnitCheckboxListItems } from '../../hooks/useChekeableUnits.js'
import { useHandleRemoveCheckedUnit } from '../../hooks/useHandleRemoveCheckedUnit.js'
import { usePlaceboDataGroup } from '../../hooks/usePlaceboDataGroup.js'
import { usePlaceboOutputData } from '../../hooks/usePlaceboOutputData.js'
import { useProcessedInputData } from '../../hooks/useProcessedInputData.js'
import { useShowPlaceboGraphs } from '../../hooks/useShowPlaceboGraphs.js'
import {
	useColumnMappingValueState,
	usePlaceboOutputResResetState,
	usePlaceboSimulationValueState,
	useTreatedUnitsValueState,
	useUserMessageValueState,
} from '../../state/index.js'
import { Container, StepDescription, StepTitle } from '../../styles/index.js'

export const ValidateEffects: React.FC = memo(function ValidateEffects() {
	const [isLoading, setIsLoading] = useState(false)

	const userMessage = useUserMessageValueState()
	const treatedUnits = useTreatedUnitsValueState()
	const columnMapping = useColumnMappingValueState()
	const isPlaceboSimulation = usePlaceboSimulationValueState()
	const resetPlaceboOutputRes = usePlaceboOutputResResetState()

	const placeboDataGroup = usePlaceboDataGroup()
	const placeboOutputData = usePlaceboOutputData()
	const showPlaceboGraphs = useShowPlaceboGraphs()
	const cannotCalculatePlacebo = useCannotCalculatePlacebo(isLoading)

	const { data } = useProcessedInputData(columnMapping)
	const unitCheckboxListItems = useUnitCheckboxListItems(data)
	const checkableUnits = unitCheckboxListItems.map(unit => unit.name)
	const handleRemoveCheckedUnit = useHandleRemoveCheckedUnit()
	const calculateEstimate = useCalculateEstimate(data, isLoading, setIsLoading)

	async function runPlaceboUnitComparison() {
		resetPlaceboOutputRes()
		for (const treatedUnit of treatedUnits) {
			await calculateEstimate(true, [treatedUnit])
		}
	}

	return (
		<Container>
			<Stack tokens={{ childrenGap: 5 }}>
				<StepTitle>Run placebo simulation</StepTitle>
				<StepDescription>
					Compare treated effects to placebo effects of untreated units.
				</StepDescription>

				<Stack horizontal grow tokens={{ childrenGap: 5 }}>
					<PrimaryButton
						disabled={cannotCalculatePlacebo}
						text="Run placebo unit comparison"
						onClick={() => void runPlaceboUnitComparison()}
					/>
					{isLoading && isPlaceboSimulation && (
						<Spinner size={SpinnerSize.medium} />
					)}
				</Stack>
			</Stack>
			{showPlaceboGraphs && (
				<PlaceboResultPane
					inputData={data}
					statusMessage={userMessage}
					isLoading={isLoading}
					placeboDataGroup={placeboDataGroup}
					placeboOutputData={placeboOutputData}
					checkableUnits={checkableUnits}
					onRemoveCheckedUnit={handleRemoveCheckedUnit}
				/>
			)}
		</Container>
	)
})
