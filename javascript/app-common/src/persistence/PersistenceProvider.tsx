/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { memo, useContext, useMemo } from 'react'

import { DataPackageContext } from '../data_package/DataPackageContext.js'
import { DefaultPersistenceService } from './DefaultPersistenceService.js'
import { PersistenceContext } from './PersistenceContext.js'

export const PersistenceProvider: React.FC<{ children: JSX.Element }> = memo(
	function PersistenceProvider({ children }) {
		const dataPackage = useContext(DataPackageContext)
		const service = useMemo(
			() => new DefaultPersistenceService(dataPackage),
			[dataPackage],
		)

		return (
			<PersistenceContext.Provider value={service}>
				{children}
			</PersistenceContext.Provider>
		)
	},
)
