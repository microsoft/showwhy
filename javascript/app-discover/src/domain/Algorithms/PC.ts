/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export enum PCVariant {
	Original = 'original',
	Stable = 'stable',
}

export enum PCCITest {
	Gauss = 'gauss',
	G2 = 'g2',
	Chi2 = 'chi2',
}

export interface PCAlgorithmParams {
	variant?: PCVariant
	alpha?: number
	ci_test?: number
}
