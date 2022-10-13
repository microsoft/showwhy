/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Icon } from '@fluentui/react'
import { memo } from 'react'

interface SelectionIconProps {
	selected: boolean
}
export const SelectionIcon: React.FC<SelectionIconProps> = memo(
	function SelectionIcon({ selected }) {
		return (
			<Icon
				iconName={selected ? 'CircleFill' : 'CircleRing'}
				style={iconStyle}
			></Icon>
		)
	},
)

const iconStyle = { fontSize: '6pt' }
