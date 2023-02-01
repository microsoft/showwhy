/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ActionButton, Icon, type IModalStyles, Modal } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import type { Theme } from '@thematic/core'
import { memo, useMemo } from 'react'
import styled from 'styled-components'

import type { EstimatedEffect } from '../types/api/EstimateEffectStatus.js'
import { JsonPreview } from './JsonPreview.js'
import { ShortenMessage } from './ShortenMessage.js'

export const ErrorInfo: React.FC<{
	text?: string
	errors?: EstimatedEffect[]
	log?: string
	styles?: React.CSSProperties
	children?: React.ReactNode
}> = memo(function ErrorInfo({
	text = 'Undefined error, please try again.',
	log = 'Undefined error, please try again.',
	errors,
	children,
	styles,
}) {
	if (log) {
		console.error('ErrorMessage:', log)
	}
	const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] =
		useBoolean(false)

	const jsonError = useMemo((): string => {
		return !errors ? '' : JSON.stringify(errors, null, 4)
	}, [errors])

	return (
		<Container style={styles}>
			<Error title={text}>
				<Icon iconName="IncidentTriangle" />
				{children}
				{!children && text.length > 100 ? <ShortenMessage text={text} /> : text}
				{!!errors && <SeeLogButton onClick={showModal} text="See log" />}
			</Error>
			<Modal
				isOpen={isModalOpen}
				onDismiss={hideModal}
				isBlocking={false}
				styles={modalStyles}
			>
				<ModalTitle>Errors log</ModalTitle>
				<JsonPreview json={excToError(jsonError)} />
			</Modal>
		</Container>
	)
})

function excToError(json: string): string {
	return json.replaceAll('exc_info', 'error')
}

const Container = styled.p`
	margin: 0;
	text-align: center;
`

const Error = styled.small`
	color: ${({ theme }: { theme: Theme }) => theme.application().error().hex()};
`

const SeeLogButton = styled(ActionButton)`
	color: ${({ theme }) => theme.palette.themePrimary};
	text-decoration: underline;
	font-size: 11px;
`

const ModalTitle = styled.h3`
	text-align: center;
`

const modalStyles = {
	main: {
		overflow: 'hidden',
		maxHeight: '80vh',
		width: '35vw',
	},
	scrollableContent: {
		overflow: 'hidden',
		padding: '1rem 1rem 5rem',
	},
} as IModalStyles
