/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useMemo } from 'react'
import {
	// usePopulationVariables,
	useExposureVariables,
	useOutcomeVariables,
	useControlVariables,
	// useSetOrUpdatePopulationVariables,
	useSetOrUpdateExposureVariables,
	useSetOrUpdateOutcomeVariables,
	useSetOrUpdateControlVariables,
} from '~state'
import { PageType, VariableDefinition } from '~types'

export function useVariables(
	pageType: PageType,
): [VariableDefinition[], (variableDefinition: VariableDefinition) => void] {
	// const population = usePopulationVariables()
	const exposure = useExposureVariables()
	const outcome = useOutcomeVariables()
	const control = useControlVariables()
	// const setPopulation = useSetOrUpdatePopulationVariables()
	const setExposure = useSetOrUpdateExposureVariables()
	const setOutcome = useSetOrUpdateOutcomeVariables()
	const setControl = useSetOrUpdateControlVariables()

	return useMemo(() => {
		switch (pageType) {
			// case PageType.Population:
			// 	return [population, setPopulation]
			case PageType.Exposure:
				return [exposure, setExposure]
			case PageType.Outcome:
				return [outcome, setOutcome]
			case PageType.Control:
				return [control, setControl]
			default:
				return [[], () => undefined]
		}
	}, [
		pageType,
		// population,
		exposure,
		outcome,
		control,
		// setPopulation,
		setExposure,
		setOutcome,
		setControl,
	])
}
