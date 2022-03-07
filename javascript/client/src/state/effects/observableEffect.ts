/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { AtomEffect } from 'recoil'
import type { Subject } from 'rxjs'

export function observableEffect<T>(observable: Subject<void>): AtomEffect<T> {
	return ({ onSet }) => {
		onSet(() => observable.next())
	}
}
