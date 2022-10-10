/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ParserOptions } from '@datashaper/schema'
import { DataFormat, DataOrientation } from '@datashaper/schema'
import type { TableContainer } from '@datashaper/tables'
import type { BaseFile } from '@datashaper/utilities'
import { extension, guessDelimiter } from '@datashaper/utilities'
import { ButtonChoiceGroup } from '@essex/components'
import type { IChoiceGroupOption } from '@fluentui/react'
import { IconButton, Modal, PrimaryButton } from '@fluentui/react'
import type ColumnTable from 'arquero/dist/types/table/column-table.js'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'

import { FileName } from './FileName.js'
import {
	buttonChoiceGroupStyles,
	Code,
	Container,
	ExampleContainer,
	ExampleLabel,
	Footer,
	FormatContainer,
	Header,
	HeaderTitle,
	ModalBody,
	ModalLabel,
	modalStyles,
	PropsContainer,
} from './ImportTable.styles.js'
import type { OpenTableHandler } from './ImportTable.types.js'
import { DATA_FORMAT_OPTIONS } from './ImportTable.utils.js'
import { TableDelimiterOptions } from './TableDelimiterOptions.js'
import { TableLayoutOptions } from './TableLayoutOptions.js'
import { TablePreview } from './TablePreview.js'
import { loadCsvTable, loadJsonTable, removeExtension } from './utils.js'

const icons = {
	cancel: { iconName: 'Cancel' },
}
export type { OpenTableHandler } from './ImportTable.types.js'

export const ImportTable: React.FC<{
	file: BaseFile
	onCancel: () => void
	onOpenTable: OpenTableHandler
}> = memo(function ImportTable({ file, onCancel, onOpenTable }) {
	const [delimiter, setDelimiter] = useState<string | undefined>(
		guessDelimiter(file.name),
	)
	const [table, setTable] = useState<ColumnTable | undefined>()
	const [name, setName] = useState<string>(removeExtension(file.name ?? ''))
	const [previewError, setPreviewError] = useState<string | undefined>()
	const [orientation, setOrientation] = useState<DataOrientation>(
		DataOrientation.Records,
	)
	const fileExtension = useMemo((): string => {
		return extension(file.path)
	}, [file])

	const [fileType, setFileType] = useState<string>(
		fileExtension.toLocaleLowerCase(),
	)

	const parserOptions = useMemo((): ParserOptions => {
		return {
			delimiter: delimiter?.length ? delimiter : undefined,
		} as ParserOptions
	}, [delimiter])

	useEffect(() => {
		const f = async () => {
			try {
				const loadedTable =
					fileType === DataFormat.CSV
						? await loadCsvTable(file, parserOptions)
						: await loadJsonTable(file, orientation)
				setPreviewError(undefined)
				setTable(loadedTable)
			} catch (_) {
				setPreviewError(
					'The selected configuration is not valid for this table.',
				)
			}
		}
		void f()
	}, [parserOptions, setTable, file, fileType, orientation])

	const onClickImport = useCallback(() => {
		if (table) {
			const id = `${name}.${fileExtension}`
			const tableContainer = { id, table } as TableContainer
			// if (autoType) {
			// 	const metadata = introspect(table, true)
			// 	tableContainer.metadata = metadata
			// }
			onOpenTable(tableContainer, fileType as DataFormat, parserOptions, {
				orientation,
			})
		}
	}, [
		onOpenTable,
		table,
		name,
		fileExtension,
		parserOptions,
		orientation,
		fileType,
	])

	const onChangeFileType = useCallback(
		(
			_?: React.FormEvent<HTMLElement | HTMLInputElement>,
			option?: IChoiceGroupOption,
		) => {
			if (option?.key === DataFormat.CSV) {
				setOrientation(DataOrientation.Records)
			}
			setFileType(option?.key as string)
		},
		[setFileType, setOrientation],
	)
	return (
		<Modal styles={modalStyles} isOpen={true} onDismiss={onCancel} isBlocking>
			<ModalHeader hideModal={onCancel} />
			<ModalBody>
				<PropsContainer>
					<FileName path={file.path} name={name} setName={setName} />
					<ButtonChoiceGroup
						style={buttonChoiceGroupStyles}
						options={DATA_FORMAT_OPTIONS}
						selectedKey={fileType}
						onChange={onChangeFileType}
					/>
				</PropsContainer>
				<ModalFileTypeProps
					delimiter={delimiter}
					setDelimiter={setDelimiter}
					orientation={orientation}
					setOrientation={setOrientation}
					fileType={fileType}
				/>
				<TablePreview error={previewError} table={table} showType />
			</ModalBody>
			<ModalFooter
				importDisabled={!!previewError}
				onClickImport={onClickImport}
			/>
		</Modal>
	)
})

const ModalHeader: React.FC<{ hideModal: () => void }> = memo(
	function ModalHeader({ hideModal }) {
		return (
			<Header>
				<HeaderTitle>Open table</HeaderTitle>
				<IconButton
					iconProps={icons.cancel}
					ariaLabel="Close popup modal"
					onClick={hideModal}
				/>
			</Header>
		)
	},
)

const ModalFooter: React.FC<{
	importDisabled: boolean
	onClickImport: () => void
}> = memo(function ModalFooter({ importDisabled, onClickImport }) {
	return (
		<Footer>
			<PrimaryButton
				disabled={importDisabled}
				text="OK"
				onClick={onClickImport}
			/>
		</Footer>
	)
})

const ModalFileTypeProps: React.FC<{
	delimiter?: string
	setDelimiter: (delimeter: string) => void
	orientation: DataOrientation
	setOrientation: (delimeter: DataOrientation) => void
	fileType: string
}> = memo(function ModalFileTypeProps({
	delimiter,
	setDelimiter,
	orientation,
	setOrientation,
	fileType,
}) {
	return (
		<Container>
			{fileType === DataFormat.CSV ? (
				<>
					<ModalLabel>Delimiter</ModalLabel>
					<TableDelimiterOptions selected={delimiter} onChange={setDelimiter} />
				</>
			) : (
				<FormatContainer>
					<TableLayoutOptions
						selected={orientation}
						onChange={setOrientation}
					/>
					<ExampleContainer>
						<ExampleLabel>Example</ExampleLabel>
						{orientation === DataOrientation.Columnar ? (
							<ExampleColumn />
						) : (
							<ExampleRow />
						)}
					</ExampleContainer>
				</FormatContainer>
			)}
		</Container>
	)
})

export const ExampleColumn: React.FC = memo(function ExampleColumn() {
	return (
		<Code>
			{`{
  "colA": [val1, val2...],
  "colB": [val1, val2...],
}`}
		</Code>
	)
})
export const ExampleRow: React.FC = memo(function ExampleColumn() {
	return (
		<Code>
			{`[
  {"colA": val1, "colB: val1},
  {"colA": val2, "colB: val2},
]`}
		</Code>
	)
})
