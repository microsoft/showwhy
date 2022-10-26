/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { uniqueId } from 'lodash'

export type CancelPromiseCallback = () => void | Promise<void>

export enum PromiseState {
	Created = 'created',
	Canceling = 'canceling',
	Canceled = 'canceled',
	Finished = 'finished',
}

export class CancelablePromise<MetadataType, PromiseReturnType> {
	public id: string
	public metadata?: MetadataType
	public promise?: Promise<PromiseReturnType>
	public cancel?: CancelPromiseCallback

	protected _state: PromiseState

	constructor(metadata?: MetadataType) {
		this.id = uniqueId()
		this.metadata = metadata
		this._state = PromiseState.Created
	}

	public getState(): PromiseState {
		return this._state
	}

	public setState(newState: PromiseState): PromiseState {
		const oldState = this._state
		this._state = newState
		return oldState
	}

	public isCancellingOrCanceled(): boolean {
		return (
			this._state === PromiseState.Canceling ||
			this._state === PromiseState.Canceled
		)
	}

	public isFinished(): boolean {
		return this._state === PromiseState.Finished
	}

	public setCanceling(): PromiseState {
		return this.setState(PromiseState.Canceling)
	}

	public setCanceled(): PromiseState {
		return this.setState(PromiseState.Canceled)
	}

	public setFinished(): PromiseState {
		return this.setState(PromiseState.Finished)
	}
}

export class CanceledPromiseError extends Error {}
