/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import { v4 as uuiv4 } from 'uuid'

import { useDefinitions, useSetDefinitions } from '../../state/definitions.js'
import {
	useCallout,
	useSelectedColumn,
} from '../../state/deriveDataVariablesPage.js'
import {
	useSetSubjectIdentifier,
	useSubjectIdentifier,
} from '../../state/subjectIdentifier.js'
import type { BeliefDegree } from '../../types/causality/BeliefDegree.js'
import type { CausalFactor } from '../../types/causality/CausalFactor.js'
import { CausalFactorType } from '../../types/causality/CausalFactorType.js'
import { CausalityLevel } from '../../types/causality/CausalityLevel.js'
import type { Definition } from '../../types/experiments/Definition.js'
import type { DefinitionType } from '../../types/experiments/DefinitionType.js'
import type { Handler, Handler1 } from '../../types/primitives.js'
import { isCausalFactorType } from '../../utils/definition.js'
import { useAddOrEditFactor } from '../causalFactors.js'
import { useSaveDefinition } from '../useSaveDefinition.js'

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
	const setDefinitions = useSetDefinitions()
	const subjectIdentifier = useSubjectIdentifier()
	const setSubjectIdentifier = useSetSubjectIdentifier()
	const saveDefinition = useSaveDefinition(definitions, setDefinitions)
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
