/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IChoiceGroupOption } from '@fluentui/react'

import { CausalDiscoveryAlgorithm } from '../domain/CausalDiscovery/CausalDiscoveryAlgorithm.js'

export const ALGORITHMS: IChoiceGroupOption[] = [
	{
		key: 'NOTEARS',
		text: 'NOTEARS',
		value: CausalDiscoveryAlgorithm.NOTEARS,
	},
	{
		key: 'DECI',
		text: 'DECI',
		value: CausalDiscoveryAlgorithm.DECI,
	},
	{
		key: 'DirectLiNGAM',
		text: 'DirectLiNGAM',
		value: CausalDiscoveryAlgorithm.DirectLiNGAM,
	},
	{
		key: 'PC',
		text: 'PC',
		value: CausalDiscoveryAlgorithm.PC,
	},
]
