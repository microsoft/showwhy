/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ActionButton, Callout, mergeStyleSets } from '@fluentui/react'
import { useBoolean, useId } from '@fluentui/react-hooks'
import type { FC } from 'react'
import { memo } from 'react'
import styled from 'styled-components'
/* eslint-disable */

export const ShortenMessage: FC<{ text: string }> = memo(
	function ShortenMessage({ text }) {
		const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] =
			useBoolean(false)
		const buttonId = useId('callout-button')

		return (
			<>
				{text.slice(0, 100)}
				{'...'}
				<SeeMoreButton
					id={buttonId}
					onClick={toggleIsCalloutVisible}
					text={'[See more]'}
				/>
				{isCalloutVisible && (
					<Callout
						className={styles.callout}
						gapSpace={0}
						target={`#${buttonId}`}
						onDismiss={toggleIsCalloutVisible}
						setInitialFocus
					>
						<Message>{text}</Message>
					</Callout>
				)}
			</>
		)
	},
)

const SeeMoreButton = styled(ActionButton)`
	color: ${({ theme }) => theme.application().accent};
	text-decoration: underline;
	padding: unset;
	span {
		margin: unset;
	}
`
const Message = styled.span`
	color: ${({ theme }) => theme.application().error};
`

const styles = mergeStyleSets({
	callout: {
		width: 320,
		maxWidth: '90%',
		padding: '20px 24px',
	},
})
