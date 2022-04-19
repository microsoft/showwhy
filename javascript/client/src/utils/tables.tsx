/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Checkbox } from '@fluentui/react'
import { ActionButtons } from '@showwhy/components'
import type { ElementDefinition, Handler1, Maybe } from '@showwhy/types'

export function getDefault(
	item: ElementDefinition,
	onEdit?: Maybe<Handler1<ElementDefinition>>,
	onDelete?: Maybe<Handler1<ElementDefinition>>,
): Record<string, any> {
	const props = Object.keys(item).filter(p => p !== 'id')
	const obj: Record<string, any> = {}

	props.forEach(prop => {
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
