/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { v4 } from 'uuid'

export function withRandomId<T>(item: T): T & { id: string } {
	return { ...item, id: v4() }
}
