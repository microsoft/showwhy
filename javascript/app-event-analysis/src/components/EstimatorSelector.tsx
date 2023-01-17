/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDropdownOption } from '@fluentui/react'
import { Dropdown } from '@fluentui/react'
import type { FormEvent } from 'react'
import { memo, useCallback, useMemo } from 'react'

import { Estimators } from '../types'
import type { EstimatorsKeyString as EstimatorsString } from '../types.js'
import type { EstimatorSelectorProps } from './EstimatorSelector.types.js'
import { getEstimatorLabel } from './EstimatorSelector.utils.js'

export const EstimatorSelector: React.FC<EstimatorSelectorProps> = memo(
	function TreatmentSelector({ estimator, onEstimatorChange }) {
		const estimatorDropdownOptions = useMemo(
			() =>
				Object.keys(Estimators).map(item => ({
					key: item,
					text: getEstimatorLabel(item as EstimatorsString),
				})),
			[],
		)

		const handleEstimatorChange = useCallback(
			(e: FormEvent, option?: IDropdownOption<string>) => {
				const optionKey = option ? (option.key as string) : ''
				const key = '' + optionKey
				if (estimator === key) return
				onEstimatorChange(key)
			},
			[estimator, onEstimatorChange],
		)

		return (
			<Dropdown
				options={estimatorDropdownOptions}
				selectedKey={estimator}
				onChange={handleEstimatorChange}
			/>
		)
	},
)
