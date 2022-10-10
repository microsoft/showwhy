/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DataPackage } from '@datashaper/workflow'
import { createContext } from 'react'

export const DataPackageContext = createContext<DataPackage>(new DataPackage())
