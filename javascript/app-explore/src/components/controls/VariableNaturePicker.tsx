/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDropdownOption } from '@fluentui/react'
import { Dropdown } from '@fluentui/react'
import { memo, useCallback, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'

import type { VariableNature } from '../../domain/VariableNature.js'
import { variableMetadataState } from '../../state/DatasetState.js'
import { options } from './VariableNaturePicker.constants.js'
import type { VariableNaturePickerProps } from './VariableNaturePicker.types.js'

// eslint-disable-next-line arrow-body-style
export const VariableNaturePicker: React.FC<VariableNaturePickerProps> = memo(
	function VariableNaturePicker({ variable }) {
		const [, setVariableMetadata] = useRecoilState(
			variableMetadataState(variable.columnName),
		)
		const pickNature = useCallback(
			(
				_ev: React.FormEvent<HTMLElement | HTMLInputElement> | undefined,
				option: IDropdownOption | undefined,
			) => {
				if (option !== undefined) {
					setVariableMetadata({
						...variable,
						nature: option.key as VariableNature,
					})
				}
			},
			[variable, setVariableMetadata],
		)

		const [variableNatureDropdownOptions, setVariableNatureDropdownOptions] =
			useState(options)
		useEffect(() => {
			setVariableNatureDropdownOptions(
				options.map(option => {
					const isPossibleNature =
						variable.columnDataNature?.possibleNatures.includes(
							option.key as VariableNature,
						)
					return { ...option, disabled: !isPossibleNature }
				}),
			)
		}, [variable])

		// const mappings = variable.nature === VariableNature.CategoricalNominal && <>

		// </>;

		return (
			<>
				<Dropdown
					defaultSelectedKey={variable.nature}
					options={variableNatureDropdownOptions}
					onChange={pickNature}
					label="Variable Nature"
					required={true}
				/>
				{/* {mappings} */}
			</>
		)
	},
)
