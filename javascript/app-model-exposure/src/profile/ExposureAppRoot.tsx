/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { RecoilBasedProfileHost } from '@datashaper/app-framework'
import { memo } from 'react'
import type { MutableSnapshot, Snapshot } from 'recoil'

import { ModelExposurePage } from '../pages/ModelExposurePage.js'
import { causalFactorsState } from '../state/causalFactors.js'
import { causalQuestionState } from '../state/causalQuestion.js'
import { defaultDatasetResultState } from '../state/defaultDatasetResult.js'
import { definitionsState } from '../state/definitions.js'
import { estimatorState } from '../state/estimators.js'
import { primarySpecificationConfigState } from '../state/primarySpecificationConfig.js'
import { projectNameState } from '../state/projectName.js'
import { selectedTableNameState } from '../state/selectedDataPackage.js'
import { ExposureResource } from './ExposureResource.js'

export const ExposureAppRoot: React.FC<{
	resource: ExposureResource
	href: string
}> = memo(function ExposureAppRoot({ resource, href }) {
	return (
		<RecoilBasedProfileHost
			resource={resource}
			saveState={saveState}
			loadState={loadState}
		>
			<ModelExposurePage href={href} />
		</RecoilBasedProfileHost>
	)
})

function loadState(resource: ExposureResource, { set }: MutableSnapshot) {
	set(projectNameState, resource.projectName)
	set(causalFactorsState, resource.causalFactors)
	set(defaultDatasetResultState, resource.defaultResult)
	set(estimatorState, resource.estimators)
	set(primarySpecificationConfigState, resource.primarySpecification)
	set(definitionsState, resource.definitions)
	set(causalQuestionState, resource.question)
	set(selectedTableNameState, resource.selectedTableName)
}

function saveState(resource: ExposureResource, snap: Snapshot) {
	resource.projectName = snap.getLoadable(projectNameState).getValue()
	resource.causalFactors = snap.getLoadable(causalFactorsState).getValue()
	resource.defaultResult = snap
		.getLoadable(defaultDatasetResultState)
		.getValue() ?? { url: '' }
	resource.estimators = snap.getLoadable(estimatorState).getValue()
	resource.primarySpecification = snap
		.getLoadable(primarySpecificationConfigState)
		.getValue()
	resource.definitions = snap.getLoadable(definitionsState).getValue()
	resource.question = snap.getLoadable(causalQuestionState).getValue()
	resource.selectedTableName =
		snap.getLoadable(selectedTableNameState).getValue() ?? ''
}
