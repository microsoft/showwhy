/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Resource } from '@datashaper/workflow'
import { Hypothesis } from '@showwhy/app-common'

import { defaultConfounderThreshold } from '../state/confounderThreshold.js'
import { defaultSpecCurveConfig } from '../state/specificationCurveConfig.js'
import { defaultSubjectIdentifier } from '../state/subjectIdentifier.js'
import type { ConfidenceIntervalStatus } from '../types/api/ConfidenceIntervalStatus.js'
import type { EstimateEffectStatus } from '../types/api/EstimateEffectStatus.js'
import type { RefutationStatus } from '../types/api/RefutationStatus.js'
import type { ShapStatus } from '../types/api/ShapStatus.js'
import type { SignificanceTestStatus } from '../types/api/SignificanceTestStatus.js'
import type { SpecificationCount } from '../types/api/SpecificationCount.js'
import type { CausalFactor } from '../types/causality/CausalFactor.js'
import { CausalModelLevel } from '../types/causality/CausalModelLevel.js'
import type { Estimator } from '../types/estimators/Estimator.js'
import { EstimatorType } from '../types/estimators/EstimatorType.js'
import type { Definition } from '../types/experiments/Definition.js'
import type { PrimarySpecificationConfig } from '../types/experiments/PrimarySpecificationConfig.js'
import type { Maybe } from '../types/primitives.js'
import type { CausalQuestion } from '../types/question/CausalQuestion.js'
import type { RunHistory } from '../types/runs/RunHistory.js'
import type { SpecificationCurveConfig } from '../types/visualization/SpecificationCurveConfig.js'
import type { DefaultDatasetResult } from '../types/workspace/DefaultDatasetResult.js'
import { PageTabs } from '../types/workspace/PageTabs.js'
import { EXPOSURE_PROFILE } from './constants.js'
import type { ExposureResourceSchema } from './ExposureResourceSchema.js'

export class ExposureResource extends Resource {
	public readonly $schema = ''
	public readonly profile = EXPOSURE_PROFILE

	public constructor(schema?: ExposureResourceSchema) {
		super()
		this.loadSchema(schema)
	}

	public defaultTitle(): string {
		return 'Exposure Analysis'
	}

	public projectName = 'Exposure Analysis'
	public causalFactors: CausalFactor[] = []
	public defaultResult: DefaultDatasetResult = { url: '' }
	public estimators: Estimator[] = []
	public primarySpecification: PrimarySpecificationConfig = {
		causalModel: CausalModelLevel.Maximum,
		type: EstimatorType.PropensityScoreStratification,
	}
	public definitions: Definition[] = []
	public question: CausalQuestion = {
		hypothesis: Hypothesis.Change,
	} as CausalQuestion
	public selectedTableName = ''
	public pageTabState: PageTabs = PageTabs.DefineQuestion
	public specCount: Maybe<SpecificationCount> = undefined
	public confidenceIntervalResponse: ConfidenceIntervalStatus[] = []
	public confounderThreshold = defaultConfounderThreshold
	public estimateEffectResponse: EstimateEffectStatus[] = []
	public refutationResponse: RefutationStatus[] = []
	public runHistory: RunHistory[] = []
	public shapResponse: ShapStatus[] = []
	public significanceTest: SignificanceTestStatus[] = []
	public specificationCurveConfig: SpecificationCurveConfig =
		defaultSpecCurveConfig
	public subjectIdentifier: Maybe<string> = defaultSubjectIdentifier

	public override toSchema(): ExposureResourceSchema {
		return {
			...super.toSchema(),
			profile: EXPOSURE_PROFILE,
			projectName: this.projectName,
			causalFactors: this.causalFactors,
			defaultResult: this.defaultResult,
			estimators: this.estimators,
			primarySpecification: this.primarySpecification,
			definitions: this.definitions,
			question: this.question,
			selectedTableName: this.selectedTableName,
			pageTabState: this.pageTabState,
			specCount: this.specCount,
			confidenceIntervalResponse: this.confidenceIntervalResponse,
			confounderThreshold: this.confounderThreshold,
			estimateEffectResponse: this.estimateEffectResponse,
			refutationResponse: this.refutationResponse,
			runHistory: this.runHistory,
			shapResponse: this.shapResponse,
			significanceTest: this.significanceTest,
			specificationCurveConfig: this.specificationCurveConfig,
			subjectIdentifier: this.subjectIdentifier,
		}
	}

	public override loadSchema(schema: ExposureResourceSchema | undefined) {
		super.loadSchema(schema)
		this.title = schema?.title ?? this.defaultTitle()
		this.projectName = schema?.projectName ?? 'Exposure Analysis'
		this.causalFactors = schema?.causalFactors ?? []
		this.defaultResult = schema?.defaultResult ?? { url: '' }
		this.estimators = schema?.estimators ?? []
		this.primarySpecification = schema?.primarySpecification ?? {
			causalModel: CausalModelLevel.Maximum,
			type: EstimatorType.PropensityScoreStratification,
		}
		this.definitions = schema?.definitions ?? []
		this.question =
			schema?.question ?? ({ hypothesis: Hypothesis.Change } as CausalQuestion)
		this.selectedTableName = schema?.selectedTableName ?? ''
		this.pageTabState = schema?.pageTabState ?? PageTabs.DefineQuestion
		this.specCount = schema?.specCount
		this.confidenceIntervalResponse = schema?.confidenceIntervalResponse ?? []
		this.confounderThreshold =
			schema?.confounderThreshold ?? defaultConfounderThreshold
		this.estimateEffectResponse = schema?.estimateEffectResponse ?? []
		this.refutationResponse = schema?.refutationResponse ?? []
		this.runHistory = schema?.runHistory ?? []
		this.shapResponse = schema?.shapResponse ?? []
		this.significanceTest = schema?.significanceTest ?? []
		this.specificationCurveConfig =
			schema?.specificationCurveConfig ?? defaultSpecCurveConfig
		this.subjectIdentifier = schema?.subjectIdentifier
	}
}
