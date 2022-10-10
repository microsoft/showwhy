/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDropdownOption, IDropdownStyles } from '@fluentui/react'
import { Dropdown, Stack } from '@fluentui/react'
import type { FormEvent } from 'react'
import { memo, useCallback, useMemo } from 'react'

import { TimeAlignmentOptions } from '../types'
import type { TimeAlignmentKeyString as TimeAlignment } from '../types.js'
import type { TimeAlignmentSelectorProps } from './TimeAlignmentSelector.types.js'
import { getTimeAlignmentLabel } from './TimeAlignmentSelector.utils.js'

export const TimeAlignmentSelector: React.FC<TimeAlignmentSelectorProps> = memo(
	function TimeAlignmentSelector({ alignment, onTimeAlignmentChange }) {
		const timeAlignmentDropdownOptions = useMemo(
			() =>
				Object.keys(TimeAlignmentOptions).map(item => ({
					key: item,
					text: getTimeAlignmentLabel(item as TimeAlignment),
				})),
			[],
		)

		const handleTimeAlignmentChange = useCallback(
			(e: FormEvent, option?: IDropdownOption<string>) => {
				const optionKey = option ? (option.key as string) : ''
				const key = '' + optionKey
				if (alignment === key) return
				onTimeAlignmentChange(key)
			},
			[alignment, onTimeAlignmentChange],
		)

		const dropdownStyles: Partial<IDropdownStyles> = {
			dropdownOptionText: { overflow: 'visible', whiteSpace: 'normal' },
			dropdownItem: { height: 'auto' },
		}

		return (
			<Stack>
				<Stack.Item>
					<Dropdown
						options={timeAlignmentDropdownOptions}
						selectedKey={alignment}
						onChange={handleTimeAlignmentChange}
						styles={dropdownStyles}
					/>
				</Stack.Item>
			</Stack>
		)
	},
)
