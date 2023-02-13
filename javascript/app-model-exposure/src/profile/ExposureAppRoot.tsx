/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { AppServices } from '@datashaper/app-framework'
import { RecoilBasedProfileHost } from '@datashaper/app-framework'
import { memo } from 'react'
import type { MutableSnapshot, Snapshot } from 'recoil'
import { v4 } from 'uuid'

import { ModelExposurePage } from '../pages/ModelExposurePage.js'
import { causalFactorsState } from '../state/causalFactors.js'
import { causalQuestionState } from '../state/causalQuestion.js'
import { confidenceIntervalResponseState } from '../state/confidenceIntervalResponse.js'
import { confounderThresholdState } from '../state/confounderThreshold.js'
import { defaultDatasetResultState } from '../state/defaultDatasetResult.js'
import { definitionsState } from '../state/definitions.js'
import { estimateEffectResponseState } from '../state/estimateEffectResponse.js'
import { estimatorState } from '../state/estimators.js'
import { PageTabState } from '../state/pageTabState.js'
import { primarySpecificationConfigState } from '../state/primarySpecificationConfig.js'
import { projectNameState } from '../state/projectName.js'
import { refutationResponseState } from '../state/refutationResponse.js'
import { runHistoryState } from '../state/runHistory.js'
import { selectedTableNameState } from '../state/selectedDataPackage.js'
import { shapResponseState } from '../state/shapResponse.js'
import { significanceTestState } from '../state/significanceTests.js'
import { specCountState } from '../state/specCount.js'
import { specificationCurveConfigState } from '../state/specificationCurveConfig.js'
import { subjectIdentifierState } from '../state/subjectIdentifier.js'
import type { ExposureResource } from './ExposureResource.js'

export const ExposureAppRoot: React.FC<{
	resource: ExposureResource
	href: string
	api: AppServices
}> = memo(function ExposureAppRoot({ resource, href, api }) {
	return (
		<RecoilBasedProfileHost
			resource={resource}
			saveState={saveState}
			loadState={loadState}
		>
			<ModelExposurePage href={href} api={api} />
		</RecoilBasedProfileHost>
	)
})

function loadState(resource: ExposureResource, { set }: MutableSnapshot) {
	const ensureId = (f: any, index: number) => ({ ...f, id: f.id ?? v4() })

	set(projectNameState, resource.projectName)
	set(causalFactorsState, resource.causalFactors.map(ensureId))
	set(defaultDatasetResultState, resource.defaultResult)
	set(estimatorState, resource.estimators)
	set(primarySpecificationConfigState, resource.primarySpecification)
	set(definitionsState, resource.definitions.map(ensureId))
	set(causalQuestionState, resource.question)
	set(selectedTableNameState, resource.selectedTableName)
	set(PageTabState, resource.pageTabState)
	set(confidenceIntervalResponseState, resource.confidenceIntervalResponse)
	set(confounderThresholdState, resource.confounderThreshold)
	set(estimateEffectResponseState, resource.estimateEffectResponse)
	set(refutationResponseState, resource.refutationResponse)
	set(runHistoryState, resource.runHistory)
	set(shapResponseState, resource.shapResponse)
	set(significanceTestState, resource.significanceTest)
	set(specCountState, resource.specCount)
	set(specificationCurveConfigState, resource.specificationCurveConfig)
	set(subjectIdentifierState, resource.subjectIdentifier)
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
	resource.pageTabState = snap.getLoadable(PageTabState).getValue()
	resource.confidenceIntervalResponse = snap
		.getLoadable(confidenceIntervalResponseState)
		.getValue()
	resource.confounderThreshold = snap
		.getLoadable(confounderThresholdState)
		.getValue()
	resource.estimateEffectResponse = snap
		.getLoadable(estimateEffectResponseState)
		.getValue()
	resource.refutationResponse = snap
		.getLoadable(refutationResponseState)
		.getValue()
	resource.runHistory = snap.getLoadable(runHistoryState).getValue()
	resource.shapResponse = snap.getLoadable(shapResponseState).getValue()
	resource.significanceTest = snap.getLoadable(significanceTestState).getValue()
	resource.specCount = snap.getLoadable(specCountState).getValue()
	resource.specificationCurveConfig = snap
		.getLoadable(specificationCurveConfigState)
		.getValue()
	resource.subjectIdentifier = snap
		.getLoadable(subjectIdentifierState)
		.getValue()
}
