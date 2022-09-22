/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	BeliefDegree,
	CausalFactor,
	Definition,
	DefinitionType,
	Handler,
	Handler1,
} from '@showwhy/types'
import { CausalFactorType, CausalityLevel } from '@showwhy/types'
import { useCallback } from 'react'
import { v4 as uuiv4 } from 'uuid'

import { useAddOrEditFactor, useSaveDefinition } from '~hooks'
import {
	useDefinitions,
	useSetSubjectIdentifier,
	useSubjectIdentifier,
} from '~state'
import { isCausalFactorType } from '~utils'

import { useCallout, useSelectedColumn } from '../DeriveDataVariablesPage.state'

export function useAddVariable(): {
	showCallout: boolean
	toggleShowCallout: Handler
	selectedColumn: string
	setSelectedColumn: Handler1<string>
	onAdd: (
		variable: string,
		type: DefinitionType | CausalFactorType,
		degree?: BeliefDegree,
	) => void
} {
	const [isCalloutVisible, toggleCallout] = useCallout()
	const [selectedColumn, setSelectedColumn] = useSelectedColumn()

	const definitions = useDefinitions()
	const subjectIdentifier = useSubjectIdentifier()
	const setSubjectIdentifier = useSetSubjectIdentifier()
	const saveDefinition = useSaveDefinition()
	const addFactor = useAddOrEditFactor()

	const onAdd = useCallback(
		(
			variable: string,
			type: DefinitionType | CausalFactorType,
			degree?: BeliefDegree,
		) => {
			if (subjectIdentifier === selectedColumn) setSubjectIdentifier(undefined)
			if (
				variable &&
				isCausalFactorType(type as CausalFactorType) &&
				degree !== undefined
			) {
				const object = {
					id: uuiv4(),
					description: '',
					variable,
					column: selectedColumn,
					causes: buildCauses(degree, type as CausalFactorType),
				} as CausalFactor
				addFactor(object)
			} else if (variable) {
				const newElement: Definition = {
					variable,
					description: '',
					level: definitions.some((d: Definition) => d.type === type)
						? CausalityLevel.Secondary
						: CausalityLevel.Primary,
					id: uuiv4(),
					column: selectedColumn,
					type: type as DefinitionType,
				}
				saveDefinition(newElement)
			}
			toggleCallout()
		},
		[
			selectedColumn,
			saveDefinition,
			toggleCallout,
			addFactor,
			definitions,
			subjectIdentifier,
			setSubjectIdentifier,
		],
	)

	return {
		showCallout: isCalloutVisible,
		toggleShowCallout: toggleCallout,
		selectedColumn,
		setSelectedColumn,
		onAdd,
	}
}

function buildCauses(degree: BeliefDegree, type: CausalFactorType) {
	const causes = {
		reasoning: '',
	}
	switch (type) {
		case CausalFactorType.Confounders:
			return {
				...causes,
				[CausalFactorType.CauseExposure]: degree,
				[CausalFactorType.CauseOutcome]: degree,
			}
		case CausalFactorType.CauseExposure:
			return {
				...causes,
				[CausalFactorType.CauseExposure]: degree,
			}
		case CausalFactorType.CauseOutcome:
			return {
				...causes,
				[CausalFactorType.CauseOutcome]: degree,
			}
	}
}
