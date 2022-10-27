/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { v4 } from 'uuid'

import type { EstimateEffectRequest } from '../types/api/EstimateEffectRequest.js'
import type { ExecutionResponse } from '../types/api/ExecutionResponse.js'
import type { NotebookRequest } from '../types/api/NotebookRequest.js'
import type { UploadFileResponse } from '../types/api/UploadFileResponse.js'
import type { SpecificationCount } from './../types/api/SpecificationCount.js'

export class FetchApiInteractor {
	public constructor(private baseUrl: string) {}

	private _project = v4()
	setProject(project: string) {
		this._project = project
	}

	public get project(): string {
		return this._project
	}

	public async fetchStatus<UpdateStatus>(
		taskId: string,
		type: string,
	): Promise<UpdateStatus> {
		const url = `${this.baseUrl}/${type}/${this.project}/${taskId}`
		return fetch(url).then(
			response => response?.json() as Promise<UpdateStatus>,
		)
	}

	public async executeValidation(
		taskId: string,
		type: string,
		body?: any, //eslint-disable-line
	): Promise<ExecutionResponse> {
		const url = `${this.baseUrl}/${type}/${this.project}`
		return fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ estimate_execution_id: taskId, ...body }),
		}).then(response => response?.json() as Promise<ExecutionResponse>)
	}

	public async executeEstimate(
		data: EstimateEffectRequest,
	): Promise<ExecutionResponse> {
		const url = `${this.baseUrl}/estimate_effect/${this.project}`
		return fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		}).then(response => response?.json() as Promise<ExecutionResponse>)
	}

	public async estimateExecutionCount(
		data: EstimateEffectRequest,
	): Promise<SpecificationCount> {
		const url = `${this.baseUrl}/estimate_effect/execution_count/${this.project}`
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
			maxRetries: 1,
		}
		return this.fetchHandler(url, options).then(
			response => response?.json() as Promise<SpecificationCount>,
		)
	}

	// eslint-disable-next-line
	public async generateNotebook(data: NotebookRequest): Promise<any> {
		const url = `${this.baseUrl}/notebook/`
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
			maxRetries: 1,
		}
		return this.fetchHandler(url, options).then(response => response?.json())
	}

	public async uploadFile(formData: FormData): Promise<UploadFileResponse> {
		const url = `${this.baseUrl}/upload/${this._project}`
		return fetch(url, {
			method: 'POST',
			body: formData,
		}).then(response => response?.json() as Promise<UploadFileResponse>)
	}

	public async cancel(taskId: string, type: string): Promise<void> {
		const url = `${this.baseUrl}/${type}/${this.project}/${taskId}`
		await fetch(url, {
			method: 'DELETE',
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
}
