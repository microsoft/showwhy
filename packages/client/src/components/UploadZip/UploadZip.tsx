/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MessageBarType } from '@fluentui/react'
import React, { memo, useEffect, useCallback, useState } from 'react'
import { MessageContainer } from '~components/MessageContainer'
import { Container } from '~styles'

interface UploadZipProps {
	id: string
	onUpload: (files: File[]) => void
}

export const UploadZip: React.FC<UploadZipProps> = memo(function UploadZip({
	id,
	onUpload,
}) {
	const [errorMessage, setErrorMessage] = useState('')

	useEffect(() => {
		const btn = document.getElementById(id)
		btn?.addEventListener(
			'change',
			async (e: any) => {
				setErrorMessage('')
				try {
					await onUpload(e?.target?.files as File[])
				} catch (error) {
					setErrorMessage((error as Error).message)
				}
			},
			false,
		)
	}, [])

	const ErrorMessage = useCallback(() => {
		return (
			<MessageContainer
				type={MessageBarType.error}
				onDismiss={() => setErrorMessage('')}
				styles={{
					position: 'absolute',
					right: '1rem',
					zIndex: 99,
					top: '3rem',
					width: '20%',
				}}
			>
				{errorMessage}
			</MessageContainer>
		)
	}, [errorMessage, setErrorMessage])

	return (
		<Container>
			{errorMessage && <ErrorMessage />}
			<input type="file" id={id} accept=".zip" style={{ display: 'none' }} />
		</Container>
	)
})
