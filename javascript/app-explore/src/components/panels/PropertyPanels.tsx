/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import { useRecoilValue } from 'recoil'

import { variableForColumnName } from '../../domain/Dataset.js'
import { relationshipsForColumnNames } from '../../domain/Graph.js'
import {
	selectableIsCausalVariable,
	selectableIsRelationship,
} from '../../domain/Selection.js'
import {
	DatasetState,
	SelectedObjectState,
	useCausalGraphState,
} from '../../state/index.js'
import { GraphPropertiesPanel } from './GraphPropertiesPanel.js'
import { RelationshipPropertiesPanel } from './RelationshipPropertiesPanel.js'
import { VariablePropertiesPanel } from './VariablePropertiesPanel.js'

export const PropertyPanels: React.FC = memo(function PropertyPanels() {
	const selection = useRecoilValue(SelectedObjectState)
	const dataset = useRecoilValue(DatasetState)
	const causalGraph = useCausalGraphState()
	let propertiesPanel
	if (selectableIsCausalVariable(selection)) {
		const selectedObject = variableForColumnName(dataset, selection.columnName)
		propertiesPanel = selectedObject && (
			<VariablePropertiesPanel variable={selectedObject} />
		)
	} else if (selectableIsRelationship(selection)) {
		const selectedObject = relationshipsForColumnNames(
			causalGraph,
			selection.source.columnName,
			selection.target.columnName,
		)
		propertiesPanel = selectedObject && (
			<RelationshipPropertiesPanel relationship={selectedObject} />
		)
	}

	if (!propertiesPanel) {
		propertiesPanel = <GraphPropertiesPanel />
	}

	return <>{propertiesPanel}</>
})
