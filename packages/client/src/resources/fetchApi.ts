/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { localhostUrl } from './utils'
import { NodeResponseStatus, OrchestratorType } from '~enums'
import {
	UploadFilesResponse,
	NodeRequest,
	NodeResponse,
	TotalExecutionsResponse,
	OrchestratorStatus,
} from '~interfaces'
import { getEnv } from '~resources/getEnv'
import { getStorageItem, SESSION_ID_KEY } from '~utils'

const {
	BASE_URL,
	CHECK_STATUS_API_KEY,
	VITE_CHECK_SIGNIFICANCE_STATUS_API_KEY,
	DOWNLOAD_FILES_API_KEY,
	ORCHESTRATORS_API_KEY,
	UPLOAD_FILES_API_KEY,
	EXECUTIONS_NUMBER_API_KEY,
} = getEnv()

export const executeNode = async (data: NodeRequest): Promise<NodeResponse> => {
	const url = `${BASE_URL}/api/orchestrators/ExecuteNodeOrchestrator?code=${ORCHESTRATORS_API_KEY}`
	return fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			session_id: getStorageItem(SESSION_ID_KEY),
			...data,
		}),
	})
		.then(response => response?.json())
		.catch(error => {
			throw new Error(error)
		})
}

export const numberExecutions = async (
	data: NodeRequest,
): Promise<TotalExecutionsResponse> => {
	const url = `${BASE_URL}/api/getnumberofexecutions?code=${EXECUTIONS_NUMBER_API_KEY}`
	const [node_data] = data.nodes
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ node_data }),
		maxRetries: 1,
	}
	return fetchHandler(url, options).then(response => response?.json())
}

export const uploadFiles = async (
	formData: FormData,
): Promise<UploadFilesResponse> => {
	const url = `${BASE_URL}/api/UploadFile?session_id=${getStorageItem(
		SESSION_ID_KEY,
	)}&code=${UPLOAD_FILES_API_KEY}`
	return fetch(url, {
		method: 'POST',
		body: formData,
	}).then(response => response?.json())
}

export const downloadFile = async (
	fileName: string,
): Promise<{ blob: Blob; url: string } | undefined> => {
	const fileUrl: { signed_url: string } = await fetch(
		`${BASE_URL}/api/getdownloadurl?session_id=${getStorageItem(
			SESSION_ID_KEY,
		)}&code=${DOWNLOAD_FILES_API_KEY}&file_name=${fileName}`,
	).then(response => response.json())
	try {
		const blob = await fetch(fileUrl.signed_url).then(response =>
			response.blob(),
		)
		return {
			blob,
			url: fileUrl.signed_url,
		}
	} catch (error) {
		window.open(fileUrl.signed_url)
	}
}

export const terminateRun = async (
	url: string,
	reason = 'User canceled the run',
): Promise<void> => {
	if (!url) return
	url = url.replace('http://functions/', 'http://localhost:81/')
	await fetch(`${url.replace('{text}', reason)}`, {
		method: 'POST',
	})
}

const fetchHandler = async (url, options, retryCount = 0) => {
	const { maxRetries = 0, ...fetchOptions } = options
	try {
		return await fetch(url, fetchOptions)
	} catch (error) {
		console.log(`Error@fetchHandler ${retryCount}/${maxRetries}`, {
			error,
		})
		if (retryCount < maxRetries) {
			return fetchHandler(url, options, retryCount + 1)
		}
		throw error
	}
}

export const returnOrchestratorStatus = async (
	url: string,
): Promise<OrchestratorStatus> => {
	return await fetch(localhostUrl(url))
		.then(response => response?.json())
		.catch(() => {
			return { runtimeStatus: NodeResponseStatus.Failed }
		})
}

export async function genericCheckStatus(
	instanceId: string,
	type: OrchestratorType,
): Promise<Partial<OrchestratorStatus>> {
	let code: string
	let path: string

	switch (type) {
		case OrchestratorType.ConfidenceInterval:
			code = VITE_CHECK_SIGNIFICANCE_STATUS_API_KEY
			path = 'checksignificanceteststatus'
			break
		case OrchestratorType.Estimator:
		default:
			code = CHECK_STATUS_API_KEY
			path = 'checkinferencestatus'
			break
	}
	try {
		const statusUrl = `${BASE_URL}/api/${path}?session=${getStorageItem(
			SESSION_ID_KEY,
		)}&code=${code}&instance=${instanceId}`

		const options = {
			headers: {
				'Content-Type': 'application/json',
			},
			maxRetries: 3,
		}

		const inferenceStatus: OrchestratorStatus = await fetchHandler(
			statusUrl,
			options,
		).then(response => response?.json())
		return inferenceStatus
	} catch (error) {
		console.log({ error })
		return { runtimeStatus: NodeResponseStatus.Failed }
	}
}
