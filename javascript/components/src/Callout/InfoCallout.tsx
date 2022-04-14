/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IconButton } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import { memo } from 'react'
import styled from 'styled-components'

import { BaseCallout } from './BaseCallout.js'

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
		<Container data-pw="callout-info">
			<Icon
				alignSelf={alignSelf}
				id={id}
				onClick={handleToggleVisible}
				iconProps={iconProps}
			/>
			<BaseCallout
				show={isVisible}
				toggleShow={handleToggleVisible}
				id={id}
				title={title}
			>
				{children}
			</BaseCallout>
		</Container>
	)
})

const Container = styled.div``

const Icon = styled(IconButton)<{ alignSelf: string }>`
	align-self: ${({ alignSelf }) => alignSelf};
`

const iconProps = { iconName: 'Info' }
