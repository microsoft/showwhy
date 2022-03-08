/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton, PrimaryButton } from '@fluentui/react'
import { Dialog, DialogFooter, DialogType } from '@fluentui/react/lib/Dialog'
import type { Handler, Maybe } from '@showwhy/types'
import { memo, useMemo } from 'react'

export const DialogConfirm: React.FC<{
	toggle: Handler
	onConfirm: Handler
	show: Maybe<boolean>
	title: string
	subText?: string
}> = memo(function DialogConfirm({ toggle, onConfirm, show, title, subText }) {
	const dialogContentProps = useMemo(
		() => ({ type: DialogType.normal, title, subText }),
		[title, subText],
	)
	return (
		<Dialog
			dialogContentProps={dialogContentProps}
			hidden={!show}
			onDismiss={toggle}
		>
			<DialogFooter>
				<PrimaryButton onClick={onConfirm} text="Yes" />
				<DefaultButton onClick={() => toggle()} text="No" />
			</DialogFooter>
		</Dialog>
	)
})
