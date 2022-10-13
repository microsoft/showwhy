/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useContext } from 'react'

import { PersistenceContext } from '../persistence/PersistenceContext.js'
import type { PersistenceService } from '../persistence/types.js'

export function usePersistenceService(): PersistenceService {
	return useContext(PersistenceContext)
}
