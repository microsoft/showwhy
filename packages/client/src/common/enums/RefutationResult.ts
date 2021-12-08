/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export enum RefutationResult {
	NotCompleted = -1,
	FailedCritical = 0,
	FailedNonCritical = 1,
	PassedAll = 2,
}

export enum RefutationResultString {
	NotCompleted = 'Refutation in progress',
	FailedCritical = 'Failed refutation',
	//FailedNonCritical = 'Review required',
	PassedAll = 'Passed refutation',
}
