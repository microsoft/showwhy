/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { SetterOrUpdater } from 'recoil'

import type { CausalVariable } from '../../domain/CausalVariable.js'
import type { Relationship } from '../../domain/Relationship.jsx'
import type { Selectable } from '../../domain/Selection.js'

export interface EdgeListProps {
	relationships: Relationship[]
	variable: CausalVariable
	onSelect: SetterOrUpdater<Selectable>
}
