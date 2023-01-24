/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Theme } from '@fluentui/react';
import { Label } from '@fluentui/react'
import styled from 'styled-components'

export const Container = styled.div`
	display: flex;
	flex-direction: column;
`

export const ATEDetailsContainer = styled.div`
	display: flex;
	flex-direction: row;
	padding: 5px;
	padding-top: 0px;
	gap: 10px;
`

export const StyledLabel = styled(Label)`
	margin-bottom: ${({ theme }: { theme: Theme }) => theme.spacing.s1};
`
