/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ICheckboxProps, ISpinButtonProps } from '@fluentui/react'

const N_GRAPHS = 1
const N_SAMPLES_PER_GRAPH = 5000
const MOST_LIKELY_GRAPH = true

export const advancedAteSpinningOptions = [
	{
		label: 'Number of graphs',
		defaultValue: N_GRAPHS.toString(),
		inputProps: { name: 'Ngraphs' },
		step: 1,
	},
	{
		label: 'Number of samples per graph',
		defaultValue: N_SAMPLES_PER_GRAPH.toString(),
		inputProps: { name: 'Nsamples_per_graph' },
		step: 1,
	},
] as ISpinButtonProps[]

export const advancedAteBooleanOptions = [
	{
		label: 'Most likely graph',
		checked: MOST_LIKELY_GRAPH,
		name: 'most_likely_graph',
	},
] as ICheckboxProps[]
