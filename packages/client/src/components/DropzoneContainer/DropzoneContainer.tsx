/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	Dropzone,
	DropzoneOptions,
	FileRejection,
} from '@data-wrangling-components/react'
import { FileCollection } from '@data-wrangling-components/utilities'
import { Icon, Spinner } from '@fluentui/react'
import { FC, memo, useMemo } from 'react'
import styled from 'styled-components'
import { DropFilesCount, Maybe } from '~types'

export const DropzoneContainer: FC<{
	loading: Maybe<boolean>
	filesCount: DropFilesCount
	text?: string
	hasSelectedFiles?: Maybe<boolean>
	onDrop?: (collection: FileCollection) => void
	onDropAccepted?: (collection: FileCollection) => void
	onDropRejected?: (message: string, files?: Maybe<FileRejection[]>) => void
	acceptedFileTypes: string[]
	dropzoneOptions?: DropzoneOptions
}> = memo(function DropzoneContainer({
	loading,
	filesCount,
	hasSelectedFiles,
	text,
	onDrop,
	onDropAccepted,
	onDropRejected,
	acceptedFileTypes,
	dropzoneOptions = {},
}) {
	const contentText = useContentText(text, hasSelectedFiles)

	return (
		<Dropzone
			placeholder={text}
			onDrop={onDrop}
			onDropAccepted={onDropAccepted}
			onDropRejected={onDropRejected}
			acceptedFileTypes={acceptedFileTypes}
			styles={styles}
			dropzoneOptions={dropzoneOptions}
		>
			{loading ? (
				<>
					<Spinner />
					<Text>
						Loading ({filesCount.completed}/{filesCount.total})
					</Text>
				</>
			) : (
				<Text>
					<FluentIcon iconName="Upload" />
					{contentText}
				</Text>
			)}
		</Dropzone>
	)
})

const Text = styled.span`
	margin-left: 4px;
	font-size: 13px;
`
const FluentIcon = styled(Icon)`
	color: ${({ theme }) => theme.application().accent().hex()};
`

const styles = {
	container: {
		margin: '0',
		padding: '0 0.5rem',
	},
}

function useContentText(
	text: Maybe<string>,
	hasSelectedFiles: Maybe<boolean>,
): string {
	return useMemo(
		() =>
			text
				? text
				: hasSelectedFiles
				? 'Upload files'
				: 'Drop some files here, or click to select files',
		[text, hasSelectedFiles],
	)
}
