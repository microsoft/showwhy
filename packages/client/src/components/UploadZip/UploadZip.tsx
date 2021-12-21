/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MessageBarType } from '@fluentui/react'
import React, { memo, useEffect, useCallback, useState } from 'react'
import { MessageContainer } from '~components/MessageContainer'
import { Container } from '~styles'

interface UploadZipProps {
	onUpload: (files: File[]) => void
	inputRef: React.RefObject<HTMLInputElement>
}

export const UploadZip: React.FC<UploadZipProps> = memo(function UploadZip({
	inputRef,
	onUpload,
}) {
	const [errorMessage, setErrorMessage] = useState('')

	useEffect(() => {
		const btn = inputRef?.current
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
	}, [inputRef])

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

	const InputZip = React.forwardRef<HTMLInputElement>(function inputZip(
		props,
		ref,
	) {
		return (
			<input
				{...props}
				ref={ref}
				type="file"
				accept=".zip"
				style={{ display: 'none' }}
			/>
		)
	})

	return (
		<Container>
			{errorMessage && <ErrorMessage />}
			<InputZip ref={inputRef} />
		</Container>
	)
})
