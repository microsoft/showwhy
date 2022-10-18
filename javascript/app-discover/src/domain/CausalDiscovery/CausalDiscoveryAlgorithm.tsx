/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export enum CausalDiscoveryAlgorithm {
	NOTEARS = 'NOTEARS',
	DECI = 'DECI',
	DECIDraftA = 'DECIDraftA',
	DECIDraftB = 'DECIDraftB',
	DECIDraftC = 'DECIDraftC',
	DirectLiNGAM = 'DirectLiNGAM',
	None = 'None',
	PC = 'PC',
}

export const CausalDiscoveryAlgorithmOptions = new Map([
	[
		CausalDiscoveryAlgorithm.DECIDraftA,
		{
			algorithm: 'DECI',
			training_options: {
				max_steps_auglag: 100,
				max_auglag_inner_epochs: 10,
			},
		},
	],
	[
		CausalDiscoveryAlgorithm.DECIDraftB,
		{
			algorithm: 'DECI',
			training_options: {
				max_steps_auglag: 10,
				max_auglag_inner_epochs: 100,
			},
		},
	],
	[
		CausalDiscoveryAlgorithm.DECIDraftC,
		{
			algorithm: 'DECI',
			training_options: {
				max_steps_auglag: 100,
				max_auglag_inner_epochs: 100,
			},
		},
	],
])
