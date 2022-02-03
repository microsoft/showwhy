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
	useTable,
	useTableTransform,
} from '../hooks'
import {
	useDefinitions,
	useBusinessLogic,
	useSetTargetVariable,
	useDefinitionActions,
} from './hooks'
import { ModelVariables } from '~components/ModelVariables'

export const ControlPage: React.FC = memo(function ControlPage() {
	const { pageType, definitions } = useBusinessLogic()

	const definitionArgs = useDefinitions(definitions)
	const { definition, onSelect } = definitionArgs
	const definitionId = definition?.id ?? ''

	const renameCallout = useRenameCallout(definition)
	const { calloutOpen, toggleCallout } = renameCallout

	const sharedLogic = useSharedBusinessLogic()
	const { toggleShowConfirmDelete } = sharedLogic

	const definitionActions = useDefinitionActions(
		toggleCallout,
		onSelect,
		toggleShowConfirmDelete,
		definition,
		calloutOpen,
	)
	const { onSave } = definitionActions

	const definitionDropdown = useDefinitionDropdown(definitions)

	const transformTable = useTableTransform(definitionId)
	const { variables, originalTable } = transformTable

	const table = useTable(definitionId, variables, originalTable)
	const setTargetVariable = useSetTargetVariable(
		definitionId,
		onSave,
		definitions,
	)

	const commandBar = useCommandBar(definitions, definitionId, setTargetVariable)

	return (
		//What if no visible columns?
		//What if no define question?
		<ModelVariables
			table={table}
			pageType={pageType}
			commandBar={commandBar}
			definitionDropdown={definitionDropdown}
			transformTable={transformTable}
			definitionArgs={definitionArgs}
			renameCalloutArgs={renameCallout}
			definitionActions={definitionActions}
			sharedLogic={sharedLogic}
		/>
	)
})
