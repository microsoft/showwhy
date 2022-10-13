/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	IIconProps,
	ISliderStyleProps,
	ISliderStyles,
	IStackTokens,
	IStyleFunctionOrObject,
} from '@fluentui/react'
import type { CSSProperties } from 'styled-components'

export const slider_stack_tokens: IStackTokens = {
	childrenGap: 5,
}

export const icon_button_props: IIconProps = {
	iconName: 'TestBeaker',
}

export const icon_button_style: CSSProperties = {
	backgroundColor: 'rgba(255, 255, 255, 0)',
}

export const slider_style: IStyleFunctionOrObject<
	ISliderStyleProps,
	ISliderStyles
> = {
	root: { flex: 1 },
	slideBox: { height: '4px' },
	valueLabel: { display: 'none' },
}

export const positive_change_text_style: CSSProperties = {
	color: 'green',
}

export const negative_change_text_style: CSSProperties = {
	color: 'red',
}
