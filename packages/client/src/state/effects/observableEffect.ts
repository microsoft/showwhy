/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Subject } from 'rxjs'
import { AtomEffect } from 'recoil'

export function observableEffect<T>(observable: Subject<void>): AtomEffect<T> {
	return ({ onSet }) => {
		onSet(() => observable.next())
	}
}
