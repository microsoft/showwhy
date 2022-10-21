/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IStyle } from '@fluentui/react'
import { MessageBar, MessageBarType } from '@fluentui/react'
import { memo, useCallback } from 'react'
import styled from 'styled-components'

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
		<Message
			messageBarType={type}
			onDismiss={onDismiss}
			dismissButtonAriaLabel="Close"
			type={MessageBarType[type]!}
			messageBarIconProps={iconProps(type)}
			styles={{ root: styles }}
		>
			{children}
		</Message>
	)
})

const Message = styled(MessageBar)<{ type: string }>`
	color: ${({ theme, type }) => theme.application()[type].hex()};
	border: 1px solid ${({ theme, type }) => theme.application()[type].hex()};
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
	border-radius: 4px;
`
