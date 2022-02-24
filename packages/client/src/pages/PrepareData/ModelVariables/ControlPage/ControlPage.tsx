/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import {
	useCommandBar,
	useDefinitionDropdown,
	useRenameCallout,
	useSharedBusinessLogic,
	useTableTransform,
} from '../hooks'
import {
	useDefinitions,
	useBusinessLogic,
	useSetTargetVariable,
	useDefinitionActions,
} from './hooks'
import { ModelVariables } from '~components/ModelVariables'
import { useCausalFactors } from '~state'

export const ControlPage: React.FC = memo(function ControlPage() {
	const { pageType, definitions } = useBusinessLogic()

	const definitionArgs = useDefinitions(definitions)
	const { definition, onSelect } = definitionArgs
	const definitionId = definition?.id ?? ''

	const renameCallout = useRenameCallout(definition)
	const { calloutOpen, toggleCallout } = renameCallout

	const sharedLogic = useSharedBusinessLogic()
	const { toggleShowConfirmDelete } = sharedLogic

	// const definitionDropdown = useDefinitionDropdown(definitions)
	const transformTable = useTableTransform(definitionId)
	const { onDuplicateDefinition, onDuplicateStep } = transformTable

	const definitionActions = useDefinitionActions(
		toggleCallout,
		onSelect,
		toggleShowConfirmDelete,
		onDuplicateDefinition,
		definition,
		calloutOpen,
	)
	const { onSave } = definitionActions

	const setTargetVariable = useSetTargetVariable(
		definitionId,
		onSave,
		definitions,
	)

	const commandBar = useCommandBar(
		definitions,
		definitionId,
		setTargetVariable,
		onDuplicateStep,
	)

	return (
		<h1>UE</h1>
		//What if no visible columns?
		//What if no define question?
		// <ModelVariables
		// 	pageType={pageType}
		// 	commandBar={commandBar}
		// 	definitionDropdown={definitionDropdown}
		// 	transformTable={transformTable}
		// 	definitionArgs={definitionArgs}
		// 	renameCalloutArgs={renameCallout}
		// 	definitionActions={definitionActions}
		// 	sharedLogic={sharedLogic}
		// />
	)
})
