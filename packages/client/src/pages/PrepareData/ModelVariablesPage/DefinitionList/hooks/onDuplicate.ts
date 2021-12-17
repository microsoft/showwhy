/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import { v4 } from 'uuid'
import { InputRef, SetModelVariables } from './types'
import { PageType } from '~enums'
import { CausalFactor, Definition, Factor } from '~interfaces'
import { GenericFn } from '~types'
import { wait } from '~utils'

interface OnDuplicateCausalFactorArgs {
	saveCausalFactor: GenericFn
	listEndRef: InputRef
	onClick: GenericFn
}

interface OnDuplicateArgs {
	saveDefinition: GenericFn
	duplicateColumn: GenericFn
	modelVariables?: Definition
	type: string
	setModelVariables: SetModelVariables
	onDuplicateCausalFactor: GenericFn
	listEndRef: InputRef
	onClick: GenericFn
}

export const useOnDuplicateCausalFactor = ({
	saveCausalFactor,
	listEndRef,
	onClick,
}: OnDuplicateCausalFactorArgs): GenericFn => {
	return useCallback(
		async (val: CausalFactor, newVariable: string) => {
			const newCausalFactor = {
				variable: newVariable,
				description: val?.description ?? '',
				id: v4(),
			} as CausalFactor

			saveCausalFactor(newCausalFactor)
			await wait(300)
			onClick(newCausalFactor)
			listEndRef?.current?.scrollIntoView({ behavior: 'smooth' })
		},

		[saveCausalFactor, onClick, listEndRef],
	)
}

export const useOnDuplicate = ({
	saveDefinition,
	duplicateColumn,
	modelVariables,
	type,
	setModelVariables,
	onDuplicateCausalFactor,
	listEndRef,
	onClick,
}: OnDuplicateArgs): GenericFn => {
	return useCallback(
		async (value: Factor) => {
			const newVariableName = value?.variable + '_copy'
			const existing = (modelVariables && modelVariables[type]) || []
			const actualVariable = existing.find(x => x.name === value.variable)
			let newColumn = value?.column
			if (actualVariable && newColumn) {
				newColumn += '_copy'
			}

			if (type === PageType.Control) {
				return onDuplicateCausalFactor(value as CausalFactor, newVariableName)
			}
			const newDefinition = {
				level: value?.level,
				variable: newVariableName,
				description: value?.description,
				column: newColumn,
				id: v4(),
			} as Factor
			const newVariable = {
				name: newVariableName,
				filters: actualVariable?.filters?.map(x => {
					const newVar = { ...x }
					newVar.id = v4()
					newVar.columnName = newVariableName + '_copy'
					return newVar
				}),
			}

			const definitionObj = {
				...modelVariables,
				[type]: [...existing, newVariable],
			}

			setModelVariables(definitionObj)
			saveDefinition(newDefinition)
			if (actualVariable) {
				duplicateColumn(newColumn as string, value.column as string)
			}
			await wait(300)
			onClick(newDefinition)
			listEndRef?.current?.scrollIntoView({ behavior: 'smooth' })
		},
		[
			saveDefinition,
			duplicateColumn,
			modelVariables,
			type,
			setModelVariables,
			onDuplicateCausalFactor,
			onClick,
			listEndRef,
		],
	)
}
