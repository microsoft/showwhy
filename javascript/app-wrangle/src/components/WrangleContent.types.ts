/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Profile } from '@datashaper/schema/dist/Profile.js'
import type { DataTable } from '@datashaper/workflow'

export interface WrangleContentProps {
	dataTable: DataTable | undefined
	resource: Profile | undefined
}
