/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DataPackage } from '@datashaper/workflow'
import { createContext } from 'react'

import { DefaultPersistenceService } from './DefaultPersistenceService.js'
import type { PersistenceService } from './types.js'

export const PersistenceContext = createContext<PersistenceService>(
	new DefaultPersistenceService(new DataPackage()),
)
