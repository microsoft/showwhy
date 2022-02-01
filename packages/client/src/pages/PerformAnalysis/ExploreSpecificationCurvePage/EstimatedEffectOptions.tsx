/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Toggle } from '@fluentui/react'
import { memo } from 'react'
import styled from 'styled-components'

export const EstimatedEffectOptions: React.FC<{
	checked: boolean | undefined
	onChange: (checked: boolean) => void
	label: string
	title: string
	disabledTitle?: string
	disabled?: boolean | undefined
}> = memo(function EstimatedEffectOptions({
	checked,
	onChange,
	label,
	title,
	disabledTitle = title,
	disabled = false,
}) {
	return (
		<ToggleComponent
			label={label}
			inlineLabel
			title={disabled ? disabledTitle : title}
			disabled={disabled}
			checked={checked}
			onChange={(_, checked) => onChange(!!checked)}
		/>
	)
})

const ToggleComponent = styled(Toggle)`
	margin-right: 24px;
	label {
		font-size: 13px;
	}
`
