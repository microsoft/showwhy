/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { NormalizedColumnMetadata } from '../../domain/CausalDiscovery/CausalDiscoveryResult.js'
import type { CausalVariable } from '../../domain/CausalVariable.js'

export interface CausalInferenceSliderProps {
	variable: CausalVariable
	columnMetadata?: Record<string, NormalizedColumnMetadata>
}
