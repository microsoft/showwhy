/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { localhostUrl, replaceAzureUrl } from './utils'
import { OrchestratorType } from '~classes'
import { getEnv } from '~resources/getEnv'
import {
	UploadFilesResponse,
	NodeRequest,
	NodeResponse,
	TotalExecutionsResponse,
	OrchestratorStatusResponse,
	NodeResponseStatus,
	Maybe,
} from '~types'
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

export async function executeNode(data: NodeRequest): Promise<NodeResponse> {
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

export async function numberExecutions(
	data: NodeRequest,
): Promise<TotalExecutionsResponse> {
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

export async function uploadFiles(
	formData: FormData,
): Promise<UploadFilesResponse> {
	const url = `${BASE_URL}/api/UploadFile?session_id=${getStorageItem(
		SESSION_ID_KEY,
	)}&code=${UPLOAD_FILES_API_KEY}`
	return fetch(url, {
		method: 'POST',
		body: formData,
	}).then(response => response?.json())
}

export async function downloadFile(
	fileName: string,
): Promise<Maybe<{ blob: Blob; url: string }>> {
	const fileUrl: { signed_url: string } = await fetch(
		`${BASE_URL}/api/getdownloadurl?session_id=${getStorageItem(
			SESSION_ID_KEY,
		)}&code=${DOWNLOAD_FILES_API_KEY}&file_name=${fileName}`,
	).then(response => response.json())
	const url = replaceAzureUrl(fileUrl.signed_url)
	try {
		const blob = await fetch(url).then(response => response.blob())
		return {
			blob,
			url,
		}
	} catch (error) {
		window.open(url)
	}
}

export async function terminateRun(
	url: string,
	reason = 'User canceled the run',
): Promise<void> {
	if (!url) return
	url = url.replace('http://functions/', 'http://localhost:81/')
	await fetch(`${url.replace('{text}', reason)}`, {
		method: 'POST',
	})
}

async function fetchHandler(
	url: string,
	options: RequestInit & { maxRetries?: number },
	retryCount = 0,
): Promise<Response> {
	const { maxRetries = 0, ...fetchOptions } = options
	try {
		return fetch(url, fetchOptions)
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

export async function returnOrchestratorStatus(
	url: string,
): Promise<OrchestratorStatusResponse> {
	return fetch(localhostUrl(url))
		.then(response => response?.json())
		.catch(() => {
			return { runtimeStatus: NodeResponseStatus.Failed }
		})
}

export async function genericCheckStatus(
	instanceId: string,
	type: OrchestratorType,
): Promise<Partial<OrchestratorStatusResponse>> {
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

		const inferenceStatus: OrchestratorStatusResponse = await fetchHandler(
			statusUrl,
			options,
		).then(response => response?.json())
		return inferenceStatus
	} catch (error) {
		console.log({ error })
		return { runtimeStatus: NodeResponseStatus.Failed }
	}
}
