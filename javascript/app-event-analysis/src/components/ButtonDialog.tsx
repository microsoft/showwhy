/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDialogFooterProps, IDialogProps } from '@fluentui/react'
import {
	DefaultButton,
	Dialog as RawDialog,
	DialogFooter as RawDialogFooter,
	DialogType,
	PrimaryButton,
} from '@fluentui/react'
import { memo, useState } from 'react'

import type { ButtonDialogProps } from './ButtonDialog.types.js'

const Dialog = RawDialog as React.FC<React.PropsWithChildren<IDialogProps>>
const DialogFooter = RawDialogFooter as React.FC<
	React.PropsWithChildren<IDialogFooterProps>
>

export const ButtonDialog: React.FC<ButtonDialogProps> = memo(
	function ButtonDialog({
		disabled,
		btnText,
		title,
		subText,
		dialogOkBtnText = 'OK',
		dialogCancelBtnText = 'Cancel',
		onOk,
	}) {
		const [hideDialog, setHideDialog] = useState(true)

		const dialogContentProps = {
			type: DialogType.normal,
			title,
			closeButtonAriaLabel: 'Close',
			subText,
		}

		const handleOkClick = () => {
			setHideDialog(true)
			onOk()
		}

		return (
			<>
				<DefaultButton
					disabled={disabled}
					onClick={() => setHideDialog(false)}
					text={btnText}
				/>
				<Dialog
					hidden={hideDialog}
					onDismiss={() => setHideDialog(true)}
					dialogContentProps={dialogContentProps}
				>
					<DialogFooter>
						<PrimaryButton onClick={handleOkClick} text={dialogOkBtnText} />
						<DefaultButton
							onClick={() => setHideDialog(true)}
							text={dialogCancelBtnText}
						/>
					</DialogFooter>
				</Dialog>
			</>
		)
	},
)
