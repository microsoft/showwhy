/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { MessageBarProps } from '../types'

export interface CustomMessageBarProps {
	type?: MessageBarProps['type']
	content: MessageBarProps['content']
}
