/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Callout, DirectionalHint, TextField } from '@fluentui/react'
import * as React from 'react'
import { KeyboardEvent, FormEvent, memo, useCallback } from 'react'
import styled from 'styled-components'

interface RenameCalloutProps {
	onSave: (name?: string) => void
	name: string
	targetId: string
	onDismiss: () => void
	onChange?: (
		event: FormEvent<HTMLInputElement | HTMLTextAreaElement>,
		newValue?: string | undefined,
	) => void
	label?: string
	direcionalHint?: DirectionalHint
	preventDismissOnLostFocus?: boolean
}

/**
 * Renders the callout attatched to the targetId, with a TextField autofocused
 * @param {string} name - The default initial string to be edited.
 * @param {string} targetId - The id of the component for the callout to be attatched
 * @param {function} onSend - The callback receiving the new name
 * @param {function} onDismiss - The callback to cancel the operation
 * @param {function} onChange - Optional callback to receive the onChange of the text field
 * @param {string} label - Optional string to use as label to the text field
 * @param {boolean} preventDismissOnLostFocus - Optional boolean to prevent dismiss when losing focus of the component
 * @param {DirectionalHint} direcionalHint - Default as topCenter, the direction that the callout will open
 * @returns the callout element
 */
export const RenameCallout: React.FC<RenameCalloutProps> = memo(
	function RenameCallout({
		name,
		targetId,
		onSave,
		onDismiss,
		onChange,
		label,
		preventDismissOnLostFocus = true,
		direcionalHint = DirectionalHint.topCenter,
	}) {
		const onKeyDown = useCallback(
			(e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
				if (e.key === 'Enter') return onSave(e.currentTarget.value)
			},
			[onSave],
		)

		return (
			<FocusCallout
				target={`#${targetId}`}
				onDismiss={onDismiss}
				directionalHint={direcionalHint}
				preventDismissOnLostFocus={preventDismissOnLostFocus}
				setInitialFocus
			>
				{label && <Label>{label}</Label>}
				<TextField
					defaultValue={name}
					onKeyDown={onKeyDown}
					onChange={onChange}
					underlined
				/>
			</FocusCallout>
		)
	},
)

const FocusCallout = styled(Callout)`
	width: 320;
	max-width: 90%;
	padding: 10px;
`

const Label = styled.label``
