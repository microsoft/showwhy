/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export interface NodeResponse {
	id: string
	purgeHistoryDeleteUri: string
	restartPostUri: string
	rewindPostUri: string
	sendEventPostUri: string
	statusQueryGetUri: string
	terminatePostUri: string
}
