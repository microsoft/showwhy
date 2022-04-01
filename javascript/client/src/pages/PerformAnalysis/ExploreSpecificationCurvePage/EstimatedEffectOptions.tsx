/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Toggle } from '@fluentui/react'
import type { Maybe } from '@showwhy/types'
import { memo } from 'react'
import styled from 'styled-components'

export const EstimatedEffectOptions: React.FC<{
	checked: Maybe<boolean>
	onChange: (checked: boolean) => void
	label: string
	title: string
	disabledTitle?: string
	disabled?: Maybe<boolean>
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
	margin-bottom: unset;
	label {
		font-size: 13px;
	}
`
