/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export enum RefutationTestMethod {
	AddUnobservedCommonCause = 'add_unobserved_common_cause',
	PlaceboTreatmentRefuter = 'placebo_treatment_refuter',
	DataSubsetRefuter = 'data_subset_refuter',
	RandomCommonCause = 'random_common_cause',
	BootstrapRefuter = 'bootstrap_refuter',
}

export enum RefutationTestMethodString {
	refuterPlaceboTreatment = 'Replace exposure with placebo',
	refuterDataSubset = 'Remove random subset of data',
	refuterAddUnobservedCommonCause = 'Add an unobserved common cause',
	refuterRandomCommonCause = 'Add a random common cause',
	refuterBootstrap = 'Bootstrap sample dataset',
}
