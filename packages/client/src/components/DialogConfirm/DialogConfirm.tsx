/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton, PrimaryButton } from '@fluentui/react'

import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog'
import { memo } from 'react'

interface DialogConfirmProps {
	toggle: () => void
	onConfirm: () => void
	show: boolean
	title: string
}

export const DialogConfirm: React.FC<DialogConfirmProps> = memo(
	function DialogConfirm({ toggle, onConfirm, show, title }) {
		return (
			<Dialog
				dialogContentProps={{ type: DialogType.normal, title }}
				hidden={!show}
				onDismiss={toggle}
			>
				<DialogFooter>
					<PrimaryButton onClick={onConfirm} text="Yes" />
					<DefaultButton onClick={toggle} text="No" />
				</DialogFooter>
			</Dialog>
		)
	},
)
