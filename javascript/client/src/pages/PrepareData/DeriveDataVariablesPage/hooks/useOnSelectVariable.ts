/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IContextualMenuItem } from '@fluentui/react'
import type { CausalFactor, Experiment, Handler1, Maybe } from '@showwhy/types'
import { useCallback } from 'react'
import type { SetterOrUpdater } from 'recoil'

import { useAddOrEditFactor, useSaveDefinition } from '~hooks'
import { isCausalFactorType } from '~utils'

import {
	useSetTargetCausalFactor,
	useSetTargetDefinition,
} from '../DeriveDataVariablesPage.hooks'

export function useOnSelectVariable(
	causalFactors: CausalFactor[],
	defineQuestion: Experiment,
	subjectIdentifier: string | undefined,
	setDefineQuestion: SetterOrUpdater<Experiment>,
	setSubjectIdentifier: SetterOrUpdater<string | undefined>,
	onSelect: Handler1<boolean>,
): (option: Maybe<IContextualMenuItem>, columnName: string) => void {
	const onSaveCausalFactor = useAddOrEditFactor()
	const setCausalFactor = useSetTargetCausalFactor(
		onSaveCausalFactor,
		causalFactors,
	)
	const onSaveDefinition = useSaveDefinition(defineQuestion, setDefineQuestion)
	const setDefinition = useSetTargetDefinition(onSaveDefinition, defineQuestion)

	return useCallback(
		(option: Maybe<IContextualMenuItem>, columnName: string) => {
			let hasVariable = false

			if (isCausalFactorType(option?.data.type)) {
				hasVariable = setCausalFactor(option?.key as string, columnName)
			} else {
				hasVariable = setDefinition(option?.key as string, columnName)
			}
			if (subjectIdentifier === columnName) {
				setSubjectIdentifier(undefined)
				hasVariable = false
			}
			onSelect(hasVariable)
		},
		[
			setCausalFactor,
			setDefinition,
			subjectIdentifier,
			setSubjectIdentifier,
			onSelect,
		],
	)
}
