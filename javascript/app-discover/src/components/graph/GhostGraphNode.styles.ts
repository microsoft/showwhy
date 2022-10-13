/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import styled from 'styled-components'

import { containerPadding } from '../../styles/styles.js'

export const NodeContainer = styled.div({
	paddingRight: containerPadding,
	paddingLeft: containerPadding,
	display: 'inline-block',
	background: '#ffffff00',
	boxShadow: '2px 2px 5px rgba(0,0,0,0.05)',
	filter: 'blur(1px)',
})
