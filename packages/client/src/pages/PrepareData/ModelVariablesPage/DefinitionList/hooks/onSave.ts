/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import { v4 } from 'uuid'
import { SetEditingDefinition, SetModelVariables } from './types'
import { DefinitionType, PageType } from '~enums'
import { CausalFactor, ElementDefinition, Definition } from '~interfaces'
import { GenericFn, StringSetter } from '~types'

interface OnSaveCausalFactorArgs {
	setNewLabel: StringSetter
	newLabel?: string
	setEditingDefinition: SetEditingDefinition
	toggleIsEditingLabel: GenericFn
	saveCausalFactor: GenericFn
}

interface OnSaveArgs {
	type: string
	setNewLabel: StringSetter
	newLabel?: string
	modelVariables?: Definition
	setEditingDefinition: SetEditingDefinition
	toggleIsEditingLabel: GenericFn
	saveDefinition: GenericFn
	onUpdate: GenericFn
	onSaveCausalFactor: GenericFn
	setModelVariables: SetModelVariables
}

export const useOnSaveCausalFactor = ({
	setNewLabel,
	newLabel,
	setEditingDefinition,
	toggleIsEditingLabel,
	saveCausalFactor,
}: OnSaveCausalFactorArgs): GenericFn => {
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

export const useOnSave = ({
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
}: OnSaveArgs): GenericFn => {
	return useCallback(
		(definition?: CausalFactor | ElementDefinition | undefined) => {
			if (type === PageType.Control) {
				return onSaveCausalFactor(definition as CausalFactor)
			}

			const newDefinition = {
				level:
					(definition as ElementDefinition)?.level ?? DefinitionType.Secondary,
				variable: newLabel,
				description: definition?.description ?? '',
				column: definition?.column ?? null,
				id: definition?.id ?? v4(),
			} as ElementDefinition

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
