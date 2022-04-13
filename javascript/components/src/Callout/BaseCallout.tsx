/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Callout } from '@fluentui/react'
import type { Handler } from '@showwhy/types'
import { memo, FC } from 'react'
import styled from 'styled-components'

export const BaseCallout: FC<{
	show: boolean
	title?: string
	toggleShow?: Handler
	id?: string
}> = memo(function BaseCallout({ show, title, children, toggleShow, id }) {
	return (
		<>
			{show && (
				<CalloutInfo
					role="alertdialog"
					gapSpace={0}
					onDismiss={toggleShow}
					setInitialFocus
					target={`#${id}`}
				>
					{title && <CalloutTitle>{title}</CalloutTitle>}
					{children}
				</CalloutInfo>
			)}
		</>
	)
})

const CalloutTitle = styled.h3`
	margin: unset;
	font-weight: bold;
`

const CalloutInfo = styled(Callout)`
	div.ms-Callout-main {
		width: 320px;
		padding: 20px 24px;
	}
`
