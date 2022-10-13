/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataPackage } from '@datashaper/workflow'
import { useContext } from 'react'

import { DataPackageContext } from '../data_package/DataPackageContext.js'

export function useDataPackage(): DataPackage {
	return useContext(DataPackageContext)
}
