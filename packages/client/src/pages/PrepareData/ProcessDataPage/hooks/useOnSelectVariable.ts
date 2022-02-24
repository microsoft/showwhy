/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { IDropdownOption } from '@fluentui/react'
import { useCallback } from 'react'
import { SetterOrUpdater } from 'recoil'
import { useAddOrEditFactor, useSaveDefinition } from '~hooks'
import { CausalFactor, Experiment, Maybe } from '~types'
import {
	useSetTargetCausalFactor,
	useSetTargetDefinition,
	DefinitionType,
} from './index'

export function useOnSelectVariable(
	causalFactors: CausalFactor[],
	defineQuestion: Experiment,
	setDefineQuestion: SetterOrUpdater<Experiment>,
) {
	const onSaveCausalFactor = useAddOrEditFactor()
	const setCausalFactor = useSetTargetCausalFactor(
		onSaveCausalFactor,
		causalFactors,
	)
	const onSaveDefinition = useSaveDefinition(defineQuestion, setDefineQuestion)
	const setDefinition = useSetTargetDefinition(onSaveDefinition, defineQuestion)

	return useCallback(
		(option: Maybe<IDropdownOption<any>>, columnName: string) => {
			if (option?.data.type === DefinitionType.Factor) {
				return setCausalFactor(option?.key as string, columnName)
			}
			setDefinition(option?.key as string, columnName)
		},
		[setCausalFactor, setDefinition],
	)
}
