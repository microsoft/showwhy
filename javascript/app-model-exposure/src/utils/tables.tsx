/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Checkbox } from '@fluentui/react'

import { ActionButtons } from '../components/ActionButtons.js'
import type { Definition } from '../types/experiments/Definition.js'
import type { Handler1, Maybe } from '../types/primitives.js'

/* eslint-disable   */
export function getDefault(
	item: Definition,
	onEdit?: Maybe<Handler1<Definition>>,
	onDelete?: Maybe<Handler1<Definition>>,
): Record<string, any> {
	const props = Object.keys(item).filter((p) => p !== 'id')
	const obj: Record<string, any> = {}

	props.forEach((prop) => {
		obj[prop] =
			typeof (item as any)[prop] === 'boolean' ? (
				<Checkbox checked={(item as any)[prop]} />
			) : (
				(item as any)[prop]
			)
		obj['actions'] = (
			<ActionButtons
				onEdit={onEdit ? () => onEdit(item) : undefined}
				onDelete={onDelete ? () => onDelete(item) : undefined}
			/>
		)
	})
	return obj
}
/* eslint-enable   */
