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

export const GeneralPage: React.FC = memo(function GeneralPage() {
	const { pageType, defineQuestionData, definitions } = useBusinessLogic()

	const definitionArgs = useDefinitions(defineQuestionData)
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

	const setTargetVariable = useSetTargetVariable(
		definitionId,
		onSave,
		defineQuestionData,
	)

	const commandBar = useCommandBar(definitions, definitionId, setTargetVariable)

	return (
		//What if no visible columns?
		//What if no define question?
		<ModelVariables
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
