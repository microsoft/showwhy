/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDropdownOption } from '@fluentui/react'

import { VariableNature } from '../../domain/VariableNature.jsx'

export const options: IDropdownOption[] = [
	{ key: VariableNature.Binary, text: 'Binary' },
	{ key: VariableNature.CategoricalNominal, text: 'Categorical Nominal' },
	{ key: VariableNature.CategoricalOrdinal, text: 'Categorical Ordinal' },
	{ key: VariableNature.Continuous, text: 'Continuous' },
	{ key: VariableNature.Discrete, text: 'Discrete' },
	{ key: VariableNature.Excluded, text: 'Exclude' },
]