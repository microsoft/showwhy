/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton, SpinButton } from '@fluentui/react'
import isEqual from 'lodash-es/isEqual.js'
import { type SyntheticEvent, memo, useEffect, useMemo, useState } from 'react'

import { Container } from '../styles/index.js'
import { ButtonWrapper, FilterContainer } from './RangeFilter.styles.js'
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
			<Container>
				<FilterContainer>
					<SpinButton
						label={labelStart}
						value={range[0].toString()}
						max={+range[1] - 1}
						min={+min}
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
				</FilterContainer>
				<ButtonWrapper>
					<DefaultButton text="Apply" onClick={handleApply} />
					<DefaultButton text="Reset" onClick={handleReset} />
				</ButtonWrapper>
			</Container>
		)
	},
)
