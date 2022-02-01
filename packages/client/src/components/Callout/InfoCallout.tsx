/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Callout, IconButton } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import { memo } from 'react'
import styled from 'styled-components'

export const InfoCallout: React.FC<{
	title?: string
	id?: string
	alignSelf?: string
}> = memo(function InfoCallout({
	title,
	children,
	alignSelf = 'baseline',
	id = 'callout-button',
}) {
	const [isVisible, { toggle: handleToggleVisible }] = useBoolean(false)

	return (
		<>
			<Icon
				alignSelf={alignSelf}
				id={id}
				onClick={handleToggleVisible}
				iconProps={iconProps}
			/>
			{isVisible && (
				<CalloutInfo
					role="alertdialog"
					gapSpace={0}
					onDismiss={handleToggleVisible}
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

const Icon = styled(IconButton)<{ alignSelf: string }>`
	align-self: ${({ alignSelf }) => alignSelf};
`

const CalloutTitle = styled.h3`
	margin-bottom: 12;
	font-weight: bold;
`

const CalloutInfo = styled(Callout)`
	div.ms-Callout-main {
		width: 320px;
		padding: 20px 24px;
	}
`

const iconProps = { iconName: 'Info' }
