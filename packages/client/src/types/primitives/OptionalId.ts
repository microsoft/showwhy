/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export type OptionalId<T extends { id: string }> = Omit<T, 'id'> & {
	id?: string
}
