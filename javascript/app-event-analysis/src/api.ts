/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import axios from 'axios'

const EVENTS_API_URL = process.env.EVENTS_API_URL?.endsWith('/')
	? process.env.EVENTS_API_URL
	: `${process.env.EVENTS_API_URL || '/api/events'}/`

export default axios.create({
	baseURL: EVENTS_API_URL,
})
