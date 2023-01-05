/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { PivotItem } from '@fluentui/react'
import { isEmpty } from 'lodash'
import { useCallback, useEffect, useRef } from 'react'

import { useProcessedInputData } from '../hooks/useProcessedInputData.js'
import {
	useCheckedUnitsState,
	useColumnMappingValueState,
	useSelectedTabKeyValueState,
	useSetChartOptionsState,
	useSetSelectedTabKeyState,
	useTreatedUnitsState,
	useTreatmentStartDatesState,
} from '../state/index.js'
import { CONFIGURATION_TABS } from '../types.js'

export function useOnHandleTabClicked() {
	const setSelectedTabKey = useSetSelectedTabKeyState()

	return useCallback(
		(itemClicked?: PivotItem) => {
			const itemKey = itemClicked?.props.itemKey
				? itemClicked.props.itemKey
				: ''
			setSelectedTabKey(itemKey)
		},
		[setSelectedTabKey],
	)
}

export function useInit() {
	const columnMapping = useColumnMappingValueState()
	const setChartOptions = useSetChartOptionsState()
	const selectedTabKey = useSelectedTabKeyValueState()
	const [checkedUnits, setCheckedUnits] = useCheckedUnitsState()
	const { data, defaultTreatment } = useProcessedInputData(columnMapping)
	const isInitialRender = useRef(true)
	const [treatedUnits, setTreatedUnits] = useTreatedUnitsState()
	const [treatmentStartDates, setTreatmentStartDates] =
		useTreatmentStartDatesState()

	useEffect(() => {
		setChartOptions(prev => ({
			...prev,
			renderRawData: selectedTabKey === CONFIGURATION_TABS.prepareAnalysis.key,
		}))
	}, [selectedTabKey])

	useEffect(() => {
		// initially, all units are checked
		if (checkedUnits === null && data.uniqueUnits.length) {
			setCheckedUnits(new Set(data.uniqueUnits))
		}
	}, [data, checkedUnits, setCheckedUnits])

	useEffect(() => {
		if (
			defaultTreatment !== null &&
			(isEmpty(treatedUnits) ||
				isEmpty(treatmentStartDates) ||
				!isInitialRender.current)
		) {
			setTreatmentStartDates(defaultTreatment.startDates)
			setTreatedUnits(defaultTreatment.units)
		}
		isInitialRender.current = false
	}, [defaultTreatment])
}
