/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton, SpinButton, Stack } from '@fluentui/react'
import isEqual from 'lodash-es/isEqual.js'
import { type SyntheticEvent, memo, useEffect, useMemo, useState } from 'react'

import type { RangeFilterProps } from './RangeFilter.types.js'

export const RangeFilter: React.FC<RangeFilterProps> = memo(
	function RangeFilter({
		defaultRange,
		min,
		max,
		step,
		labelStart,
		labelEnd,
		onApply,
		onReset,
	}) {
		const defaults: [number, number] = useMemo(
			() => defaultRange || [min, max],
			[defaultRange, min, max],
		)
		const [range, setRange] = useState<[number, number]>(defaults)
		const handleStartValueChange = (e: SyntheticEvent, newVal?: string) => {
			if (!newVal) return
			setRange([+newVal, range[1]])
		}
		const handleEndValueChange = (e: SyntheticEvent, newVal?: string) => {
			if (!newVal) return
			setRange([range[0], +newVal])
		}

		const handleApply = () => {
			onApply(range)
		}

		const handleReset = () => {
			setRange([min, max])
			onReset()
		}

		useEffect(() => {
			const init = [0, 0]
			if (!isEqual(defaults, init) && isEqual(range, init)) {
				setRange(defaults)
			}
		}, [range, defaults])

		return (
			<Stack tokens={{ childrenGap: 10 }}>
				<Stack horizontal tokens={{ childrenGap: 5 }}>
					<SpinButton
						label={labelStart}
						value={range[0].toString()}
						min={+min}
						max={+range[1] - 1}
						step={step}
						onChange={handleStartValueChange}
					/>
					<SpinButton
						label={labelEnd}
						value={range[1].toString()}
						min={+range[0] + 1}
						max={+max}
						step={step}
						onChange={handleEndValueChange}
					/>
				</Stack>
				<Stack horizontal reversed tokens={{ childrenGap: 5 }}>
					<Stack.Item align="end">
						<DefaultButton text="Apply" onClick={handleApply} />
					</Stack.Item>
					<Stack.Item align="end">
						<DefaultButton text="Reset" onClick={handleReset} />
					</Stack.Item>
				</Stack>
			</Stack>
		)
	},
)
