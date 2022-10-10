/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataPackage, DataTable } from '@datashaper/workflow'
import { useContext, useEffect, useState } from 'react'

import { DataPackageContext } from '../data_package/DataPackageContext.js'

export function useDataTables(): DataTable[] {
	const dp = useContext(DataPackageContext)
	const [packages, setPackages] = useState(() => extractPackages(dp))
	useEffect(
		() => dp.tableStore.onChange(() => setPackages(extractPackages(dp))),
		[dp, dp.tableStore],
	)
	return packages
}

function extractPackages(dp: DataPackage): DataTable[] {
	return [...dp.tableStore.tables.values()]
}
