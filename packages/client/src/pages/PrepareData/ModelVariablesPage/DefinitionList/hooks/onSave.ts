/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import { v4 } from 'uuid'
import { SetEditingDefinition, SetModelVariables } from './types'
import { DefinitionType, PageType } from '~enums'
import { CausalFactor, Definition, Factor } from '~interfaces'
import { Setter } from '~types'

export function useOnSaveCausalFactor({
	setNewLabel,
	newLabel,
	setEditingDefinition,
	toggleIsEditingLabel,
	saveCausalFactor,
}: {
	setNewLabel: Setter<string | undefined>
	newLabel?: string
	setEditingDefinition: SetEditingDefinition
	toggleIsEditingLabel: () => void
	saveCausalFactor: (factor: CausalFactor) => void
}): (definition?: CausalFactor) => void {
	return useCallback(
		(definition?: CausalFactor) => {
			const newCausalFactor = {
				variable: newLabel,
				description: definition?.description ?? '',
				column: definition?.column ?? null,
				id: definition?.id ?? v4(),
			} as CausalFactor

			saveCausalFactor(newCausalFactor)
			toggleIsEditingLabel()
			setEditingDefinition(undefined)
			setNewLabel('')
		},
		[
			setNewLabel,
			newLabel,
			setEditingDefinition,
			toggleIsEditingLabel,
			saveCausalFactor,
		],
	)
}

export function useOnSave({
	type,
	setNewLabel,
	newLabel,
	modelVariables,
	setEditingDefinition,
	toggleIsEditingLabel,
	saveDefinition,
	onUpdate,
	onSaveCausalFactor,
	setModelVariables,
}: {
	type: string
	setNewLabel: Setter<string | undefined>
	newLabel?: string
	modelVariables?: Definition
	setEditingDefinition: SetEditingDefinition
	toggleIsEditingLabel: () => void
	saveDefinition: (def: Factor) => void
	onUpdate: (label: string) => void
	onSaveCausalFactor: (factor: CausalFactor) => void
	setModelVariables: SetModelVariables
}): (definition?: Factor) => void {
	return useCallback(
		(definition?: Factor) => {
			if (type === PageType.Control) {
				return onSaveCausalFactor(definition as CausalFactor)
			}

			const newDefinition = {
				level: definition?.level ?? DefinitionType.Secondary,
				variable: newLabel ?? '',
				description: definition?.description ?? '',
				column: definition?.column ?? '',
				id: definition?.id ?? v4(),
			}

			const existing = (modelVariables && modelVariables[type]) || []
			const actualVariables = existing.filter(
				x => x.name === definition?.variable,
			)
			const newVariables = actualVariables.map(x => {
				return {
					...x,
					name: newLabel,
				}
			})

			const definitionObj = {
				...modelVariables,
				[type]: [...existing, ...newVariables],
			}

			setModelVariables(definitionObj)
			saveDefinition(newDefinition)
			onUpdate(newLabel as string)
			toggleIsEditingLabel()
			setEditingDefinition(undefined)
			setNewLabel('')
		},
		[
			type,
			setNewLabel,
			newLabel,
			modelVariables,
			setEditingDefinition,
			toggleIsEditingLabel,
			saveDefinition,
			onUpdate,
			onSaveCausalFactor,
			setModelVariables,
		],
	)
}
