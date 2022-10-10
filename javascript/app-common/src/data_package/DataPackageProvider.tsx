/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { DataPackage } from '@datashaper/workflow'
import { memo, useMemo } from 'react'

import { DataPackageContext } from './DataPackageContext.js'

export const TableStoreProvider: React.FC<{ children: JSX.Element }> = memo(
	function TableStoreProvider({ children }) {
		const store = useMemo(() => new DataPackage(), [])

		return (
			<DataPackageContext.Provider value={store}>
				{children}
			</DataPackageContext.Provider>
		)
	},
)
