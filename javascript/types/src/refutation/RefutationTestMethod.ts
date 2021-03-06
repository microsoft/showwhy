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
