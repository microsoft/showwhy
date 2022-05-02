/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FetchApiInteractor } from '@showwhy/api-client'

import { getStorageItem, SESSION_ID_KEY } from '~state'

import { getEnv } from './environment'

const env = getEnv()

export const api = new FetchApiInteractor(
	env.BASE_URL,
	env.VITE_API_FUNCTIONS_KEY,
	() => getStorageItem(SESSION_ID_KEY) || '',
)
