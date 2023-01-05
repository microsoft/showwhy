/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { FontIcon } from '@fluentui/react'
import type { FluentTheme } from '@thematic/fluent'
import styled from 'styled-components'

export const ErrorIcon = styled(FontIcon)`
	color: ${({ theme }: { theme: FluentTheme }) =>
		theme.application().error().hex()};
	cursor: pointer;
	align-self: center;
`
