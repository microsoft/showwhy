/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export interface EstimandIdentificationVariables {
	estimate_possibility: boolean
	backdoor_variables: string[]
	frontdoor_variables: string[]
	instrumental_variables: string[]
}
