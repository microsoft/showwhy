/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataOrientation } from '@datashaper/schema'
import { DataFormat } from '@datashaper/schema'
import type { DataTable } from '@datashaper/workflow'
import {
	Checkbox,
	ChoiceGroup,
	Position,
	SpinButton,
	TextField,
} from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import {
	TableDelimiterOptions,
	TablePreview,
	useDataTableSource,
} from '@showwhy/app-common'
import { choiceGroupStyles } from '@showwhy/app-common/src/file_management/TableDelimiterOptions.styles.js'
import { TableLayoutOptions } from '@showwhy/app-common/src/file_management/TableLayoutOptions.js'
import { useDebounceFn } from 'ahooks'
import { memo, useCallback, useEffect, useState } from 'react'

import {
	checkboxContainerStyle,
	Container,
	FieldContainer,
	Grid,
	ParserOptionsContainer,
	RadioBoxLabel,
	spinButtonStyles,
	tabeLayoutOptionsStyle,
	TableFormatContainer,
	textFieldStyles,
} from './ParserOptionsEditor.styles.js'

const lineTerminatorOptions = [
	{ key: '\r', text: '\\r' },
	{ key: '\r\n', text: '\\r\\n' },
	{ key: '\n', text: '\\n' },
]

export const ParserOptionsEditor: React.FC<{ dataTable: DataTable }> = memo(
	function ParserOptionsEditor({ dataTable }) {
		const table = useDataTableSource(dataTable)
		const [headers, { toggle: toggleHeaders }] = useBoolean(
			!dataTable?.parser.names?.length,
		)

		useEffect(() => {
			if (headers && !!dataTable?.parser.names?.length) {
				dataTable.parser.names = undefined
			}
		}, [headers, dataTable.parser])

		const onChangeParser = useCallback(
			(
				option: string | boolean | number | string[] | undefined,
				optName: string,
			) => {
				if (!dataTable) return // eslint-disable-next-line
				;(dataTable.parser as any)[optName] = option
			},
			[dataTable],
		)

		const onChangeOrientation = useCallback(
			(orientation: DataOrientation) => {
				if (!dataTable) return
				dataTable.shape.orientation = orientation
			},
			[dataTable],
		)

		return (
			<ParserOptionsContainer>
				<TableFormatContainer>
					{dataTable?.format === DataFormat.CSV ? (
						<Grid>
							<Container>
								<RadioBoxLabel>Delimiter</RadioBoxLabel>
								<TableDelimiterOptions
									selected={dataTable.parser?.delimiter}
									onChange={(delim: string) =>
										onChangeParser(delim, 'delimiter')
									}
								/>
							</Container>
							<Container>
								<RadioBoxLabel>Line terminator</RadioBoxLabel>
								<ChoiceGroup
									disabled
									title="Option temporarily disabled"
									selectedKey={dataTable.parser.lineTerminator}
									options={lineTerminatorOptions}
									onChange={(_, option) =>
										onChangeParser(option?.key, 'lineTerminator')
									}
									styles={choiceGroupStyles}
								/>
							</Container>
							<FieldContainer>
								<TextField
									label="Quote char"
									styles={textFieldStyles}
									disabled
									title="Option temporarily disabled"
									onChange={(_, value) => onChangeParser(value, 'quoteChar')}
									value={dataTable.parser.quoteChar}
								></TextField>
								<TextField
									styles={textFieldStyles}
									label="Escape char"
									disabled
									title="Option temporarily disabled"
									onChange={(_, value) => onChangeParser(value, 'escapeChar')}
									value={dataTable.parser.escapeChar}
								></TextField>
								<TextField
									label="Comment"
									styles={textFieldStyles}
									onChange={(_, value) => {
										onChangeParser(value || undefined, 'comment')
									}}
									value={dataTable.parser.comment || ''}
								></TextField>
								<SpinButton
									styles={spinButtonStyles}
									labelPosition={Position.top}
									label="Skip rows"
									value={dataTable.parser.skipRows.toString()}
									min={0}
									step={1}
									onChange={(_, value) =>
										onChangeParser(+(value as string), 'skipRows')
									}
									incrementButtonAriaLabel="Increase value by 1"
									decrementButtonAriaLabel="Decrease value by 1"
								/>
								<SpinButton
									styles={spinButtonStyles}
									labelPosition={Position.top}
									label="Read rows"
									value={dataTable.parser.readRows.toString()}
									min={0}
									step={1}
									onChange={(_, value) =>
										onChangeParser(+(value as string), 'readRows')
									}
									incrementButtonAriaLabel="Increase value by 1"
									decrementButtonAriaLabel="Decrease value by 1"
								/>
							</FieldContainer>

							<FieldContainer style={checkboxContainerStyle}>
								<Checkbox
									label="Skip blank lines"
									disabled
									title="Option temporarily disabled"
									checked={dataTable.parser.skipBlankLines}
									onChange={(_, value) =>
										onChangeParser(value, 'skipBlankLines')
									}
								/>
								<HeadersOption
									headers={dataTable.parser.names}
									headersChecked={headers}
									toggleHeaders={toggleHeaders}
									onChange={(value: string[] | undefined) => {
										onChangeParser(value, 'names')
									}}
								/>
							</FieldContainer>
						</Grid>
					) : (
						<TableLayoutOptions
							styles={tabeLayoutOptionsStyle}
							selected={dataTable.shape.orientation}
							onChange={onChangeOrientation}
						/>
					)}
				</TableFormatContainer>
				<Container>{table && <TablePreview table={table} />}</Container>
			</ParserOptionsContainer>
		)
	},
)

export const HeadersOption: React.FC<{
	headers: string[] | undefined
	onChange: (val: string[] | undefined) => void
	headersChecked: boolean
	toggleHeaders: () => void
}> = memo(function HeadersOption({
	headersChecked,
	toggleHeaders,
	headers,
	onChange,
}) {
	const [value, setValue] = useState(headers?.join(','))

	const handleValueChange = useDebounceFn(
		() => {
			onChange(value?.trim().split(','))
		},
		{ wait: 1000 },
	)

	const onChangeValue = useCallback(
		(
			_: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
			val?: string,
		) => {
			setValue(val)
			handleValueChange.run() // eslint-disable-line
		},
		[setValue, handleValueChange],
	)

	return (
		<FieldContainer style={checkboxContainerStyle}>
			<Checkbox
				label="Headers"
				checked={headersChecked}
				onChange={toggleHeaders}
			/>
			{!headersChecked && <TextField value={value} onChange={onChangeValue} />}
		</FieldContainer>
	)
})
