/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { IDropdownOption } from '@fluentui/react'
import { useMemo } from 'react'
import { FactorsOrDefinitions } from '~types'

export function useDefinitionDropdown(
	definitionOptions: FactorsOrDefinitions,
): IDropdownOption[] {
	return useMemo((): IDropdownOption[] => {
		return definitionOptions.map(x => {
			return {
				key: x.id,
				text: x.variable,
				data: x.column ? iconProps.check : iconProps.questionMark,
			} as IDropdownOption
		})
	}, [definitionOptions])
}

const iconProps = {
	check: { icon: 'StatusCircleCheckmark' },
	questionMark: { icon: 'StatusCircleQuestionMark' },
}
