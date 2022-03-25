/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	Maybe,
	NodeRequest,
	NodeResponse,
	OrchestratorStatusResponse,
	TotalExecutionsResponse,
	UploadFilesResponse,
} from '@showwhy/types'
import { NodeResponseStatus } from '@showwhy/types'

import { OrchestratorType } from './Orchestrator/index.js'

export class FetchApiInteractor {
	public constructor(
		private baseUrl: string,
		private checkStatusApiKey: string,
		private checkSignificanceStatusApiKey: string,
		private downloadFilesApiKey: string,
		private orchestratorsApiKey: string,
		private uploadFilesApiKey: string,
		private executionsNumberApiKey: string,
		private getSessionKey: () => string,
	) {}

	public async executeNode(data: NodeRequest): Promise<NodeResponse> {
		const url = `${this.baseUrl}/api/orchestrators/ExecuteNodeOrchestrator?code=${this.orchestratorsApiKey}`
		return fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				session_id: this.getSessionKey(),
				...data,
			}),
		})
			.then(response => response?.json())
			.catch(error => {
				throw new Error(error)
			})
	}

	public async numberExecutions(
		data: NodeRequest,
	): Promise<TotalExecutionsResponse> {
		const url = `${this.baseUrl}/api/getnumberofexecutions?code=${this.executionsNumberApiKey}`
		const [node_data] = data.nodes
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ node_data }),
			maxRetries: 1,
		}
		return this.fetchHandler(url, options).then(response => response?.json())
	}

	public async uploadFiles(formData: FormData): Promise<UploadFilesResponse> {
		const url = `${
			this.baseUrl
		}/api/UploadFile?session_id=${this.getSessionKey()}&code=${
			this.uploadFilesApiKey
		}`

		return fetch(url, {
			method: 'POST',
			body: formData,
		}).then(response => response?.json())
	}

	public async downloadFile(
		fileName: string,
	): Promise<Maybe<{ blob: Blob; url: string }>> {
		const fileUrl: { signed_url: string } = await fetch(
			`${
				this.baseUrl
			}/api/getdownloadurl?session_id=${this.getSessionKey()}&code=${
				this.downloadFilesApiKey
			}&file_name=${fileName}`,
		).then(response => response.json())
		const url = this.replaceAzureUrl(fileUrl.signed_url)
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

	public async terminateRun(
		url: string,
		reason = 'User canceled the run',
	): Promise<void> {
		if (!url) return
		url = url.replace('http://functions/', 'http://localhost:81/')
		await fetch(`${url.replace('{text}', reason)}`, {
			method: 'POST',
		})
	}

	public async fetchHandler(
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
				return this.fetchHandler(url, options, retryCount + 1)
			}
			throw error
		}
	}

	public async getOrchestratorStatus(
		url: string,
	): Promise<OrchestratorStatusResponse> {
		return fetch(this.localhostUrl(url))
			.then(response => response?.json())
			.catch(() => {
				return { runtimeStatus: NodeResponseStatus.Failed }
			})
	}

	public async genericCheckStatus(
		instanceId: string,
		type: OrchestratorType,
	): Promise<Partial<OrchestratorStatusResponse>> {
		let code: string
		let path: string

		switch (type) {
			case OrchestratorType.ConfidenceInterval:
				code = this.checkSignificanceStatusApiKey
				path = 'checksignificanceteststatus'
				break
			case OrchestratorType.Estimator:
			default:
				code = this.checkStatusApiKey
				path = 'checkinferencestatus'
				break
		}
		try {
			const statusUrl = `${
				this.baseUrl
			}/api/${path}?session=${this.getSessionKey()}&code=${code}&instance=${instanceId}`

			const options = {
				headers: {
					'Content-Type': 'application/json',
				},
				maxRetries: 3,
			}

			const inferenceStatus: OrchestratorStatusResponse =
				await this.fetchHandler(statusUrl, options).then(response =>
					response?.json(),
				)
			return inferenceStatus
		} catch (error) {
			console.log({ error })
			return { runtimeStatus: NodeResponseStatus.Failed }
		}
	}

	private localhostUrl(url: string): string {
		return url.replace('http://functions/', 'http://localhost:81/')
	}

	private replaceAzureUrl(url: string): string {
		const regExp = new RegExp(/^https?:\/\/localhost:10000/)
		return url.replace(regExp, this.baseUrl)
	}
}
