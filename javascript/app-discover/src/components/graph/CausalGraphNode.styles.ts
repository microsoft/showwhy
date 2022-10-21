/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultEffects } from '@fluentui/react'
import styled from 'styled-components'

import { containerPadding } from '../../styles/styles.js'

export const NodeContainer = styled.div({
	paddingLeft: containerPadding,
	display: 'inline-block',
	backgroundColor: '#FFFFFF99',
	backdropFilter: 'blur(2px)',
	boxShadow: DefaultEffects.elevation8,
})
