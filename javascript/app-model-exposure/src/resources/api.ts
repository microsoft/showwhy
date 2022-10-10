/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FetchApiInteractor } from '../api-client/FetchApiInteractor.js'
import { getEnv } from './environment.js'

const env = getEnv()

export const api = new FetchApiInteractor(env.EXPOSURE_API_URL)
