/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step } from './Step'

export interface Panel {
	id: string
	name: string
	steps: Step[]
}
