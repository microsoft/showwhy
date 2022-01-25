/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export interface AlternativeModelsReq {
	confounders: string[]
	outcome_determinants: string[]
	label: string
	type: string
}
