/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataTable } from '@datashaper/workflow'
import { useObservableState } from 'observable-hooks'
import { useContext } from 'react'

import { DataPackageContext } from '../data_package/DataPackageContext.js'

export function useDataTables(): DataTable[] {
	const dp = useContext(DataPackageContext)
	return useObservableState(dp.tableStore.tables$, () => [])
}
