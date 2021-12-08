/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { v4 } from 'uuid'
import { localhostUrl } from './utils'
import { NodeResponseStatus, StatusType } from '~enums'
import {
	UploadFileResponse,
	NodeRequest,
	NodeResponse,
	StatusResponse,
	CheckStatus,
	TotalExecutionsResponse,
	SignificanceTestResponse,
} from '~interfaces'

type Status = CheckStatus | SignificanceTestResponse

const baseUrl = import.meta.env.VITE_API_URI as string
const CHECK_STATUS_API_KEY = import.meta.env.VITE_CHECK_STATUS_API_KEY as string
const VITE_CHECK_SIGNIFICANCE_STATUS_API_KEY = import.meta.env
	.VITE_CHECK_SIGNIFICANCE_STATUS_API_KEY as string
const DOWNLOAD_FILES_API_KEY = import.meta.env
	.VITE_DOWNLOAD_FILES_API_KEY as string
const ORCHESTRATORS_API_KEY = import.meta.env
	.VITE_ORCHESTRATORS_API_KEY as string
const UPLOAD_FILES_API_KEY = import.meta.env.VITE_UPLOAD_FILES_API_KEY as string
const EXECUTIONS_NUMBER_API_KEY = import.meta.env
	.VITE_EXECUTIONS_NUMBER_API_KEY as string

export const getSessionId = (reset = false): string => {
	reset && sessionStorage.removeItem('sessionId')
	let sessionId = sessionStorage.getItem('sessionId')
	if (!sessionId) {
		sessionId = v4()
		sessionStorage.setItem('sessionId', sessionId)
	}
	return sessionId
}

export const executeNode = async (data: NodeRequest): Promise<NodeResponse> => {
	const url = `${baseUrl}/api/orchestrators/ExecuteNodeOrchestrator?code=${ORCHESTRATORS_API_KEY}`
	return fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			session_id: getSessionId(),
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
	const url = `${baseUrl}/api/getnumberofexecutions?code=${EXECUTIONS_NUMBER_API_KEY}`
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

export const uploadFile = async (
	formData: FormData,
): Promise<UploadFileResponse> => {
	const url = `${baseUrl}/api/UploadFile?session_id=${getSessionId(
		true,
	)}&code=${UPLOAD_FILES_API_KEY}`
	return fetch(url, {
		method: 'POST',
		body: formData,
	}).then(response => response?.json())
}

export const checkStatus = async (
	statusUrl: string,
): Promise<Partial<CheckStatus>> => {
	return genericCheckStatus(statusUrl, StatusType.Estimate)
}

export const checkSignificanceStatus = async (
	statusUrl: string,
): Promise<Partial<SignificanceTestResponse>> => {
	return genericCheckStatus(
		statusUrl,
		StatusType.Significance,
	) as Partial<SignificanceTestResponse>
}

export const downloadFile = async (
	sessionId: string,
	fileName: string,
): Promise<{ blob: Blob; url: string } | undefined> => {
	const fileUrl: { signed_url: string } = await fetch(
		`${baseUrl}/api/getdownloadurl?session_id=${sessionId}&code=${DOWNLOAD_FILES_API_KEY}&file_name=${fileName}`,
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

async function genericCheckStatus(
	statusUrl: string,
	type: StatusType,
): Promise<Partial<Status>> {
	let code
	let path

	switch (type) {
		case StatusType.Significance:
			code = VITE_CHECK_SIGNIFICANCE_STATUS_API_KEY
			path = 'checksignificanceteststatus'
			break
		case StatusType.Estimate:
		default:
			code = CHECK_STATUS_API_KEY
			path = 'checkinferencestatus'
			break
	}
	try {
		const status: StatusResponse = await (
			await fetch(localhostUrl(statusUrl))
		).json()

		if (status.runtimeStatus === NodeResponseStatus.Failed) {
			const error = `
			Error@${status.name} - Status: ${status.runtimeStatus}
			InstanceId: ${status.instanceId}
			${!!status.output ? (status.output as string) : ''}
		`
			throw new Error(error)
		}

		const url = `${baseUrl}/api/${path}?session=${getSessionId()}&code=${code}&instance=${
			status.instanceId
		}`

		const options = {
			headers: {
				'Content-Type': 'application/json',
			},
			maxRetries: 3,
		}

		const inferenceStatus: Status = await fetchHandler(url, options).then(
			response => response?.json(),
		)
		return {
			...status,
			...inferenceStatus,
		}
	} catch (error) {
		console.log({ error })
		return { runtimeStatus: NodeResponseStatus.Failed }
	}
}
