/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	ATEDetails,
	ATEDetailsByName,
} from '../domain/CausalDiscovery/CausalDiscoveryResult.js'

export type onChangeATEDetailsFn = (
	variableName: string,
	details: ATEDetails,
) => void

export interface DeciATEDetailsParamsProps {
	ateDetailsByName: ATEDetailsByName | undefined
	onChangeATEDetails: onChangeATEDetailsFn
}
