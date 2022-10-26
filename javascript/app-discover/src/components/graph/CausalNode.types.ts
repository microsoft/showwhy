/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { NormalizedColumnsMetadataByName } from '../../domain/CausalDiscovery/CausalDiscoveryResult.js'
import type { CausalVariable } from '../../domain/CausalVariable.js'

export interface CausalNodeProps {
	className?: string
	variable: CausalVariable
	useFixedInterventionRanges?: boolean
	columnsMetadata?: NormalizedColumnsMetadataByName
	isSelectable?: boolean
	isAddable?: boolean
	isRemovable?: boolean
	center?: boolean
	wasDragged?: boolean
}
