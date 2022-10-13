/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SearchBox } from '@fluentui/react'
import { memo } from 'react'

import type { ListFilterProps } from './ListFilter.types.js'

export const ListFilter: React.FC<ListFilterProps> = memo(function ListFilter({
	list,
	filterHandler,
	placeholder,
	filter,
	children,
}) {
	const changeHandler = (
		e?: React.ChangeEvent<HTMLInputElement>,
		newValue?: string,
	) => {
		if (newValue === undefined) {
			return
		}

		filterHandler(list, newValue)
	}

	return (
		<>
			<SearchBox
				placeholder={placeholder}
				onChange={changeHandler}
				value={filter}
			/>
			{children}
		</>
	)
})
