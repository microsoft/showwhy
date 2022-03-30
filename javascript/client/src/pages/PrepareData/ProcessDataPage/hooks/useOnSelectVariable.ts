/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IContextualMenuItem } from '@fluentui/react'
import type { CausalFactor, Experiment, Maybe } from '@showwhy/types'
import { useCallback } from 'react'
import type { SetterOrUpdater } from 'recoil'

import { useAddOrEditFactor, useSaveDefinition } from '~hooks'
import { isCausalFactorType } from '~utils'

import { useSetTargetCausalFactor, useSetTargetDefinition } from './index'

export function useOnSelectVariable(
	causalFactors: CausalFactor[],
	defineQuestion: Experiment,
	subjectIdentifier: string | undefined,
	setDefineQuestion: SetterOrUpdater<Experiment>,
	setSubjectIdentifier: SetterOrUpdater<string | undefined>,
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
			if (subjectIdentifier === columnName) {
				setSubjectIdentifier(undefined)
			}
			if (isCausalFactorType(option?.data.type)) {
				setCausalFactor(option?.key as string, columnName)
			} else {
				setDefinition(option?.key as string, columnName)
			}
		},
		[setCausalFactor, setDefinition, subjectIdentifier, setSubjectIdentifier],
	)
}
