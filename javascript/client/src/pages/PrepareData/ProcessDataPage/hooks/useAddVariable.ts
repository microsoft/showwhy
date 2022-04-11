/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useBoolean } from '@fluentui/react-hooks'
import type {
	BeliefDegree,
	CausalFactor,
	ElementDefinition,
	Handler,
	Handler1,
} from '@showwhy/types'
import {
	CausalFactorType,
	CausalityLevel,
	DefinitionType,
} from '@showwhy/types'
import { useCallback, useState } from 'react'
import { v4 as uuiv4 } from 'uuid'

import { useAddOrEditFactorTestable, useSaveDefinition } from '~hooks'
import {
	useCausalFactors,
	useExperiment,
	useSetCausalFactors,
	useSetExperiment,
	useSetSubjectIdentifier,
	useSubjectIdentifier,
} from '~state'
import { isCausalFactorType } from '~utils'

export function useAddVariable(): {
	showCallout: boolean
	toggleShowCallout: Handler
	selectedColumn: string
	setSelectedColumn: Handler1<string>
	onAdd: (variable: string, type: DefinitionType, degree?: BeliefDegree) => void
} {
	const [showCallout, { toggle: toggleShowCallout }] = useBoolean(false)
	const [selectedColumn, setSelectedColumn] = useState('')

	const defineQuestion = useExperiment()
	const setDefineQuestion = useSetExperiment()
	const subjectIdentifier = useSubjectIdentifier()
	const setSubjectIdentifier = useSetSubjectIdentifier()
	const saveDefinition = useSaveDefinition(defineQuestion, setDefineQuestion)
	const causalFactors = useCausalFactors()
	const setCausalFactors = useSetCausalFactors()
	const addFactor = useAddOrEditFactorTestable(causalFactors, setCausalFactors)

	const onAdd = useCallback(
		(variable: string, type: DefinitionType, degree?: BeliefDegree) => {
			if (subjectIdentifier === selectedColumn) setSubjectIdentifier(undefined)
			if (isCausalFactorType(type) && degree) {
				const object = {
					id: uuiv4(),
					description: '',
					variable: variable,
					column: selectedColumn,
					causes: buildCauses(degree, type),
				} as CausalFactor
				addFactor(object)
			} else {
				const newElement: ElementDefinition = {
					variable: variable,
					description: '',
					level: (defineQuestion as any)?.definitions.some(
						(d: ElementDefinition) => d.type === type,
					)
						? CausalityLevel.Secondary
						: CausalityLevel.Primary,
					id: uuiv4(),
					column: selectedColumn,
					type,
				}
				saveDefinition(newElement)
			}
			toggleShowCallout()
		},
		[
			selectedColumn,
			saveDefinition,
			toggleShowCallout,
			addFactor,
			defineQuestion,
			subjectIdentifier,
			setSubjectIdentifier,
		],
	)
	return {
		showCallout,
		toggleShowCallout,
		selectedColumn,
		setSelectedColumn,
		onAdd,
	}
}

function buildCauses(degree: BeliefDegree, type: DefinitionType) {
	const causes = {
		reasoning: ''
	}
	switch (type) {
		case DefinitionType.Confounders:
			return {
				...causes,
				[CausalFactorType.CauseExposure]: degree,
				[CausalFactorType.CauseOutcome]: degree,
			}
		case DefinitionType.CauseExposure:
			return {
				...causes,
				[CausalFactorType.CauseExposure]: degree,
			}
		case DefinitionType.CauseOutcome:
			return {
				...causes,
				[CausalFactorType.CauseOutcome]: degree,
			}
	}
}
