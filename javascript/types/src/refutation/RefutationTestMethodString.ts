/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export enum RefutationTestMethodString {
	refuterPlaceboTreatment = 'Replace exposure with placebo',
	refuterDataSubset = 'Remove random subset of data',
	refuterAddUnobservedCommonCause = 'Add an unobserved common cause',
	refuterRandomCommonCause = 'Add a random common cause',
	refuterBootstrap = 'Bootstrap sample dataset',
}
