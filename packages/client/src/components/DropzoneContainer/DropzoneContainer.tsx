/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultButton, Icon, Spinner } from '@fluentui/react'
import { FC, memo } from 'react'
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
			: 'Drop some files here, or click to select files'
		return (
			<DragFilesArea isButton={isButton} disabled={loading} {...containerProps}>
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
			</DragFilesArea>
		)
	},
)

const LoadingText = styled.span`
	margin-left: 4px;
`
const DragFilesArea = styled(DefaultButton)<{
	isDragging: boolean
	isButton: boolean
}>`
	display: flex;
	white-space: nowrap;
	margin: 8px;
	color: ${({ theme, isDragging }) =>
		isDragging
			? theme.application().accent().hex()
			: theme.application().foreground().hex()};
	opacity: ${({ isDragging }) => (isDragging ? 0.5 : 1)};
	border: 1px
		${({ theme, isButton }) =>
			!isButton
				? 'dashed ' + theme.application().accent().hex()
				: 'solid ' + theme.application().foreground().hex()};
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
