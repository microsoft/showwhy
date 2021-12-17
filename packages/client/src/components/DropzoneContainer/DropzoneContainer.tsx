/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton, Icon, Spinner } from '@fluentui/react'
import { FC, memo, useCallback } from 'react'
import type { DropzoneInputProps, DropzoneRootProps } from 'react-dropzone'
import styled from 'styled-components'
import { DropFilesCount } from '~interfaces'

export interface DropzoneContainerProps {
	loading: boolean
	isDragActive: boolean
	isButton: boolean
	filesCount: DropFilesCount
	text?: string
	getRootProps: <T extends DropzoneRootProps>(props?: T | undefined) => T
	getInputProps: <T extends DropzoneInputProps>(props?: T | undefined) => T
}

export const DropzoneContainer: FC<DropzoneContainerProps> = memo(
	function DropzoneContainer({
		children,
		loading,
		filesCount,
		isDragActive,
		isButton,
		text,
		getRootProps,
		getInputProps,
	}) {
		const containerProps = { ...getRootProps(), isDragging: isDragActive }

		const contentText = text
			? text
			: isButton
			? 'Upload files'
			: `Drag 'n' drop some files here, or click to select files`
		const content = (
			<>
				<input {...getInputProps()} />
				{loading ? (
					<>
						<Spinner />
						<LoadingText>
							Loading ({filesCount.completed}/{filesCount.total})
						</LoadingText>
					</>
				) : (
					<>
						<Icon iconName="Upload" />
						{contentText}
					</>
				)}
				<Container>
					<ChildContainer>{children}</ChildContainer>
				</Container>
			</>
		)

		if (isButton) {
			return (
				<DragFilesButton disabled={loading} {...containerProps}>
					{content}
				</DragFilesButton>
			)
		}
		return <DragFilesArea {...containerProps}>{content}</DragFilesArea>
	},
)

const LoadingText = styled.span`
	margin-left: 4px;
`
const DragFilesButton = styled(DefaultButton)<{
	isDragging: boolean
}>`
	display: flex;
	white-space: nowrap;
	margin: 8px;
	color: ${({ theme, isDragging }) =>
		isDragging ? theme.application().accent : theme.application().foreground};
	opacity: ${({ isDragging }) => (isDragging ? 0.5 : 1)};
`

const DragFilesArea = styled.section<{
	isDragging: boolean
}>`
	white-space: nowrap;
	margin: 8px;
	opacity: ${({ isDragging }) => (isDragging ? 0.5 : 1)};
	width: 100%;
	height: 75%;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	font-weight: 500;
	padding: 1rem;
	border: 2px dashed ${({ theme }) => theme.application().accent};
	border-radius: 5px;
	margin-top: 5rem;
`

const Container = styled.div`
	position: relative;
	height: 100%;
`
const ChildContainer = styled.div`
	text-align: center;
	display: flex;
	justify-content: space-around;
	font-weight: bold;
	margin: auto;
	height: 100%;
`
