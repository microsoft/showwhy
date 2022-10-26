/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { NormalizedColumnsMetadataByName } from '../../domain/CausalDiscovery/CausalDiscoveryResult.js'
import type { CausalVariable } from '../../domain/CausalVariable.js'

export interface CausalInferenceSliderProps {
	variable: CausalVariable
	columnsMetadata?: NormalizedColumnsMetadataByName
	wasDragged?: boolean
}
