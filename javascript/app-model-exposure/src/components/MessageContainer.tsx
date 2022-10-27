/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IStyle } from '@fluentui/react'
import { MessageBar, MessageBarType } from '@fluentui/react'
import { memo, useCallback } from 'react'

import type { Handler } from '../types/primitives.js'
/* eslint-disable */

export const MessageContainer: React.FC<{
	type?: MessageBarType
	onDismiss?: Handler
	styles?: IStyle
	children?: React.ReactNode
}> = memo(function MessageContainer({
	children,
	type = MessageBarType.info,
	onDismiss,
	styles = {},
}) {
	const iconProps = useCallback((type: MessageBarType) => {
		switch (type) {
			case MessageBarType.error:
				return { iconName: 'Error' }
			case MessageBarType.info:
				return { iconName: 'Info' }
			case MessageBarType.success:
				return { iconName: 'Completed' }
			case MessageBarType.warning:
				return { iconName: 'Warning' }
		}
	}, [])
	return (
		<MessageBar
			messageBarType={type}
			onDismiss={onDismiss}
			dismissButtonAriaLabel="Close"
			messageBarIconProps={iconProps(type)}
			styles={{ root: styles }}
		>
			{children}
		</MessageBar>
	)
})
