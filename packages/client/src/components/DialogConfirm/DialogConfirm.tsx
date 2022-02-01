/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton, PrimaryButton } from '@fluentui/react'
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog'
import { Maybe } from '~types'
import { memo, useMemo } from 'react'

export const DialogConfirm: React.FC<{
	toggle: () => void
	onConfirm: () => void
	show: Maybe<boolean>
	title: string
}> = memo(function DialogConfirm({ toggle, onConfirm, show, title }) {
	const dialogContentProps = useMemo(
		() => ({ type: DialogType.normal, title }),
		[title],
	)
	return (
		<Dialog
			dialogContentProps={dialogContentProps}
			hidden={!show}
			onDismiss={toggle}
		>
			<DialogFooter>
				<PrimaryButton onClick={onConfirm} text="Yes" />
				<DefaultButton onClick={toggle} text="No" />
			</DialogFooter>
		</Dialog>
	)
})
