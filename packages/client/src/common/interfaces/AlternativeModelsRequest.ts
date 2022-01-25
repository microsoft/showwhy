/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export interface AlternativeModelsRequest {
	confounders: string[]
	outcome_determinants: string[]
	label: string
	type: string
}
