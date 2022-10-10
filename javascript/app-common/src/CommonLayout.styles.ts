/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Theme } from '@thematic/core'
import styled from 'styled-components'

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
	margin: 0;
	padding: 0;
	overflow: hidden;
	max-height: 100%;
	max-width: 100%;
`
export const MainArea = styled.div`
	display: flex;
	flex-direction: row;
	flex: 1;
	margin: 0;
	padding: 0;
	overflow: hidden;
	max-height: 100%;
	max-width: 100%;
`

export const Content = styled.main`
	display: flex;
	flex-direction: column;
	flex: 1;
	max-height: 100%;
	height: 100%;
	min-width: 30%;
`

export const Rail = styled.aside`
	display: flex;
	flex-direction: column;
	margin: 0;
	padding: 0;
	width: 100%;
	max-height: 100%;
	justify-self: stretch;
	overflow: hidden;
`

export const LeftRail = styled(Rail)`
	border-right: 1px solid;
	${({ theme }: { theme: Theme }) => theme.application().lowContrast().hex()};
`

export const RightRail = styled(Rail)`
	border-left: 1px solid
		${({ theme }: { theme: Theme }) => theme.application().lowContrast().hex()};
`
