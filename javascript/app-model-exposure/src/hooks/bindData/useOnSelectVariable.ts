/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IContextualMenuItem } from '@fluentui/react'
import { useCallback } from 'react'
import type { SetterOrUpdater } from 'recoil'

import type { CausalFactor } from '../../types/causality/CausalFactor.js'
import type { Definition } from '../../types/experiments/Definition.js'
import type { Maybe } from '../../types/primitives.js'
import { isCausalFactorType } from '../../utils/definition.js'
import { useAddOrEditFactor } from '../causalFactors.js'
import { useSaveDefinition } from '../useSaveDefinition.js'
import { useSetTargetCausalFactor } from './useSetTargetCausalFactor.js'
import { useSetTargetDefinition } from './useSetTargetDefinition.js'

export function useOnSelectVariable(
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
			if (isCausalFactorType(option?.data?.type)) {
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
