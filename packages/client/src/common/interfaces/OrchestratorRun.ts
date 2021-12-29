/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Orchestrator } from '~classes'

export interface OrchestratorRun {
	orchestrator: Orchestrator
	cancel(): Promise<void>
	execute(...args: any): Promise<void>
}
