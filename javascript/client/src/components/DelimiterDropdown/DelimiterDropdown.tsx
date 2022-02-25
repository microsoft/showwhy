/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Dropdown, IDropdownOption, IDropdownProps } from '@fluentui/react'

const delimiterOptions: IDropdownOption[] = [
	{ key: '\t', text: 'Tab' },
	{ key: ';', text: 'Semicolon' },
	{ key: ',', text: 'Comma' },
	{ key: ' ', text: 'Space' },
]

export const DelimiterDropdown: React.FC<Partial<IDropdownProps>> = ({
	options,
	...rest
}) => {
	return <Dropdown label="Delimiter" options={delimiterOptions} {...rest} />
}
