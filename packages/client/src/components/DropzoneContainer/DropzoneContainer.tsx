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
	filesCount: DropFilesCount
	getRootProps: <T extends DropzoneRootProps>(props?: T | undefined) => T
	getInputProps: <T extends DropzoneInputProps>(props?: T | undefined) => T
}

export const DropzoneContainer: FC<DropzoneContainerProps> = memo(
	function DropzoneContainer({
		children,
		loading,
		filesCount,
		isDragActive,
		getRootProps,
		getInputProps,
	}) {
		const containerProps = { ...getRootProps(), isDragging: isDragActive }

		return (
			<DragFilesContainer disabled={loading} {...containerProps}>
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
						Upload dataset
					</>
				)}
				<Container>
					<ChildContainer>{children}</ChildContainer>
				</Container>
			</DragFilesContainer>
		)
	},
)

const LoadingText = styled.span`
	margin-left: 4px;
`
const DragFilesContainer = styled(DefaultButton)<{
	isDragging: boolean
}>`
	display: flex;
	white-space: nowrap;
	margin: 8px;
	border: 1px solid
		${({ theme, isDragging }) =>
			isDragging ? theme.application().accent : theme.application().foreground};
	color: ${({ theme, isDragging }) =>
		isDragging ? theme.application().accent : theme.application().foreground};
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
