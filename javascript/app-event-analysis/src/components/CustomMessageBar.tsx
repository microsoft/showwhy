/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MessageBar, MessageBarType } from '@fluentui/react'
import { memo } from 'react'

import type { CustomMessageBarProps } from './CustomMessageBar.types.js'

export const CustomMessageBar: React.FC<CustomMessageBarProps> = memo(
	function CustomMessageBar({ type, content }) {
		return (
			<MessageBar messageBarType={type || MessageBarType.info}>
				{content}
			</MessageBar>
		)
	},
)
