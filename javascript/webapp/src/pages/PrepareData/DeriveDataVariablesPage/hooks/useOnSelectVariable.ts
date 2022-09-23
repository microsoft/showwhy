/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IContextualMenuItem } from '@fluentui/react'
import type { Maybe } from '@showwhy/types'
import { useCallback } from 'react'

import { useAddOrEditFactor } from '~hooks'
import { useSetSubjectIdentifier, useSubjectIdentifier } from '~state'
import { isCausalFactorType } from '~utils'

import {
	useSetTargetCausalFactor,
	useSetTargetDefinition,
} from '../DeriveDataVariablesPage.hooks'
import { useStepIsDone } from './useIsStepDone'

export function useOnSelectVariable(): (
	option: Maybe<IContextualMenuItem>,
	columnName: string,
) => void {
	const onSaveCausalFactor = useAddOrEditFactor()
	const setCausalFactor = useSetTargetCausalFactor(onSaveCausalFactor)
	const subjectIdentifier = useSubjectIdentifier()

	const onSelect = useStepIsDone()
	const setSubjectIdentifier = useSetSubjectIdentifier()
	const setDefinition = useSetTargetDefinition()

	return useCallback(
		(option: Maybe<IContextualMenuItem>, columnName: string) => {
			let hasVariable = false

			if (isCausalFactorType(option?.data?.type)) {
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
