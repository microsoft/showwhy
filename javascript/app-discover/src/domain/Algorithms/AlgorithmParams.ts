/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DECIAlgorithmParams } from './DECI.js'
import type { NotearsAlgorithmParams } from './Notears.js'
import type { PCAlgorithmParams } from './PC.js'

export type AlgorithmParams =
	| NotearsAlgorithmParams
	| DECIAlgorithmParams
	| PCAlgorithmParams
