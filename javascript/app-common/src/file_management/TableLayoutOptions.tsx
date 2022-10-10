/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataOrientation } from '@datashaper/schema'
import type {
	IChoiceGroupOption,
	IChoiceGroupStyleProps,
	IChoiceGroupStyles,
	IStyleFunctionOrObject,
} from '@fluentui/react'
import { ChoiceGroup } from '@fluentui/react'
import { memo } from 'react'

import { DATA_LAYOUT_OPTIONS } from './TableLayoutOptions.utils.js'

export const TableLayoutOptions: React.FC<{
	selected?: DataOrientation
	onChange: (orientation: DataOrientation) => void
	styles?: IStyleFunctionOrObject<IChoiceGroupStyleProps, IChoiceGroupStyles>
}> = memo(function TableLayoutOptions({ selected, onChange, styles }) {
	return (
		<ChoiceGroup
			selectedKey={selected}
			styles={styles}
			options={DATA_LAYOUT_OPTIONS}
			onChange={(
				_?: React.FormEvent<HTMLElement | HTMLInputElement>,
				val?: IChoiceGroupOption,
			) => {
				val && onChange(val.key as DataOrientation)
			}}
			label="Data format"
		/>
	)
})
