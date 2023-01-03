/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { PivotItem } from '@fluentui/react'
import { isEmpty } from 'lodash'
import { useCallback, useEffect, useRef } from 'react'

import { useProcessedInputData } from '../hooks/useProcessedInputData.js'
import {
	useColumnMappingState,
	useSetSelectedTabKeyState,
	useTreatedUnitsState,
	useTreatmentStartDatesState,
} from '../state/index.js'

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
	const [columnMapping] = useColumnMappingState()
	const { defaultTreatment } = useProcessedInputData(columnMapping)
	const isInitialRender = useRef(true)
	const [treatedUnits, setTreatedUnits] = useTreatedUnitsState()
	const [treatmentStartDates, setTreatmentStartDates] =
		useTreatmentStartDatesState()
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
