/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Resource } from '@datashaper/workflow'
import { Hypothesis } from '@showwhy/app-common'

import type { CausalFactor } from '../types/causality/CausalFactor.js'
import { CausalModelLevel } from '../types/causality/CausalModelLevel.js'
import type { Estimator } from '../types/estimators/Estimator.js'
import { EstimatorType } from '../types/estimators/EstimatorType.js'
import type { Definition } from '../types/experiments/Definition.js'
import type { PrimarySpecificationConfig } from '../types/experiments/PrimarySpecificationConfig.js'
import type { CausalQuestion } from '../types/question/CausalQuestion.js'
import type { DefaultDatasetResult } from '../types/workspace/DefaultDatasetResult.js'
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
	}
}
