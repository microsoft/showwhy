/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export interface RangeFilterProps {
	defaultRange?: [number, number] | null
	min: number
	max: number
	step: number
	labelStart: string
	labelEnd: string
	onApply: (filter: [number, number]) => void
	onReset: () => void
}
