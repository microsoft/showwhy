/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IChoiceGroupOption } from '@fluentui/react'

import { CausalDiscoveryAlgorithm } from '../domain/CausalDiscovery/CausalDiscoveryAlgorithm.js'

export const ALGORITHMS: IChoiceGroupOption[] = [
	{
		key: 'DECIDraftA',
		text: 'DECI Draft (i: 100, j: 10)',
		value: CausalDiscoveryAlgorithm.DECIDraftA,
	},
	{
		key: 'DECIDraftB',
		text: 'DECI Draft (i: 10, j: 100)',
		value: CausalDiscoveryAlgorithm.DECIDraftB,
	},
	{
		key: 'DECIDraftC',
		text: 'DECI Draft (i: 100, j:100)',
		value: CausalDiscoveryAlgorithm.DECIDraftC,
	},
	{
		key: 'DECI',
		text: 'DECI Full Quality (i: 20, j:1000)',
		value: CausalDiscoveryAlgorithm.DECI,
	},
	{
		key: 'NOTEARS',
		text: 'NOTEARS',
		value: CausalDiscoveryAlgorithm.NOTEARS,
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
