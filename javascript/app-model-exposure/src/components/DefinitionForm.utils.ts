/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { CausalityLevel } from '../types/causality/CausalityLevel.js'
import type { Definition } from '../types/experiments/Definition.js'
import type { DefinitionType } from '../types/experiments/DefinitionType.js'
import type { Maybe } from '../types/primitives.js'
import { withRandomId } from '../utils/ids.js'

export function updateListTypes(
	definitions: Maybe<Definition[]>,
	type: Maybe<DefinitionType>,
): Definition[] {
	const isPrimary = definitions?.find(
		(d) => d.type === type && d.level === CausalityLevel.Primary,
	)

	let result = definitions ? [...definitions] : []
	if (isPrimary) {
		result = result.map((d) => {
			if (d.id === isPrimary.id) {
				return { ...d, level: CausalityLevel.Secondary }
			}
			return d
		})
	}
	return result
}

export function wait(ms: number): Promise<boolean> {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(true)
		}, ms)
	})
}

export async function saveDefinitions(
	definition: Definition | Definition[],
	definitions: Definition[],
	setDefinitions: (definitions: Definition[]) => void,
): Promise<void> {
	if (!definition) {
		return
	}
	let list = [...definitions]
	if (!Array.isArray(definition)) {
		list = [...list, withRandomId(definition)]
	} else if (definition.length) {
		list = [...definition]
	}
	setDefinitions(list)
	await wait(500)
}

export function handlePrimaryDefinition(
	definition: Definition,
	definitions: Definition[],
) {
	const primaryDefinition = definitions.find(
		d => d.level === CausalityLevel.Primary && d.type === definition.type,
	)

	if (!primaryDefinition) {
		return definitions.map(d => {
			if (d.default && d.type === definition.type) {
				return {
					...d,
					level: CausalityLevel.Primary,
				}
			}
			return d
		})
	}
	return definitions
}
