/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	ICommandBarItemProps,
	IContextualMenuItem,
	IDetailsColumnProps,
	IRenderFunction,
} from '@fluentui/react'
import { CommandBar } from '@fluentui/react'
import { useCallback } from 'react'
import type { SetterOrUpdater } from 'recoil'

import { useDefinitionDropdownOptions } from '../hooks/bindData/useDefinitionDropdownOptions.js'
import { useOnResetVariable } from '../hooks/bindData/useOnResetVariable.js'
import { useOnSetSubjectIdentifier } from '../hooks/bindData/useOnSetSubjectIdentifier.js'
import { useRenderDropdown } from '../hooks/bindData/useRenderDropdownOption.js'
import { useSetTargetCausalFactor } from '../hooks/bindData/useSetTargetCausalFactor.js'
import { useSetTargetDefinition } from '../hooks/bindData/useSetTargetDefinition.js'
import { useAddOrEditFactor } from '../hooks/causalFactors.js'
import { useAllVariables } from '../hooks/useAllVariables.js'
import { useSaveDefinition } from '../hooks/useSaveDefinition.js'
import { useCausalFactors } from '../state/causalFactors.js'
import { useDefinitions, useSetDefinitions } from '../state/definitions.js'
import {
	useSetSubjectIdentifier,
	useSubjectIdentifier,
} from '../state/subjectIdentifier.js'
import type { CausalFactor } from '../types/causality/CausalFactor.js'
import type { Definition } from '../types/experiments/Definition.js'
import type { Maybe } from '../types/primitives.js'
import { isCausalFactorType } from '../utils/definition.js'
import { commandBarStyles } from './BindDataPage.styles.js'

export function useCommandBar(): IRenderFunction<IDetailsColumnProps> {
	const causalFactors = useCausalFactors()
	const definitions = useDefinitions()
	const setDefinitions = useSetDefinitions()
	const allElements = useAllVariables(causalFactors, definitions)
	const setSubjectIdentifier = useSetSubjectIdentifier()
	const subjectIdentifier = useSubjectIdentifier()

	const onSetSubjectIdentifier = useOnSetSubjectIdentifier(
		subjectIdentifier,
		setSubjectIdentifier,
	)

	const onSelectVariable = useOnSelectVariable(
		causalFactors,
		definitions,
		subjectIdentifier,
		setDefinitions,
		setSubjectIdentifier,
	)

	const dropdownOptions = useDefinitionDropdownOptions(
		definitions,
		causalFactors,
	)
	const onResetVariable = useOnResetVariable(
		allElements,
		dropdownOptions,
		onSelectVariable,
	)

	const renderDropdown = useRenderDropdown(
		allElements,
		onSelectVariable,
		onResetVariable,
		onSetSubjectIdentifier,
		subjectIdentifier,
		dropdownOptions,
	)

	return useCreateCommandBar(renderDropdown)
}

function useCreateCommandBar(
	renderDropdown: (columnName: string) => JSX.Element,
): () => JSX.Element {
	return useCallback(
		(props?: IDetailsColumnProps) => {
			const columnName = props?.column.name ?? ''
			const items: ICommandBarItemProps[] = [
				{
					key: 'definition',
					iconOnly: true,
					onRender: () => renderDropdown(columnName),
				},
			]
			return <CommandBar items={items} styles={commandBarStyles} />
		},
		[renderDropdown],
	)
}

function useOnSelectVariable(
	causalFactors: CausalFactor[],
	definitions: Definition[],
	subjectIdentifier: string | undefined,
	setDefinitions: SetterOrUpdater<Definition[]>,
	setSubjectIdentifier: SetterOrUpdater<string | undefined>,
): (option: Maybe<IContextualMenuItem>, columnName: string) => void {
	const onSaveCausalFactor = useAddOrEditFactor()
	const setCausalFactor = useSetTargetCausalFactor(
		onSaveCausalFactor,
		causalFactors,
	)
	const onSaveDefinition = useSaveDefinition(definitions, setDefinitions)
	const setDefinition = useSetTargetDefinition(onSaveDefinition, definitions)

	return useCallback(
		(option: Maybe<IContextualMenuItem>, columnName: string) => {
			//eslint-disable-next-line
			if (isCausalFactorType(option?.data.type)) {
				setCausalFactor(option?.key as string, columnName)
			} else {
				setDefinition(option?.key as string, columnName)
			}
			if (subjectIdentifier === columnName) {
				setSubjectIdentifier(undefined)
			}
		},
		[setCausalFactor, setDefinition, subjectIdentifier, setSubjectIdentifier],
	)
}
