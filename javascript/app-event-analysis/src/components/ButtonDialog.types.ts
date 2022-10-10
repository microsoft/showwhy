/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export interface ButtonDialogProps {
	btnText: string
	title: string
	subText: string
	disabled: boolean
	dialogOkBtnText?: string
	dialogCancelBtnText?: string
	onOk: () => void
}
