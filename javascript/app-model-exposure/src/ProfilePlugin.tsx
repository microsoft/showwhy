import {
	AppServices,
	CommandBarSection,
	ProfilePlugin,
	RecoilBasedProfileHost,
} from '@datashaper/app-framework'
import { Hypothesis } from '@showwhy/app-common'
import { memo } from 'react'
import { Resource, DataPackage } from '@datashaper/workflow'
import { MutableSnapshot, Snapshot } from 'recoil'
import { projectNameState } from './state/projectName.js'
import { causalFactorsState } from './state/causalFactors.js'
import { CausalFactor } from './types/causality/CausalFactor.js'
import { DefaultDatasetResult } from './types/workspace/DefaultDatasetResult.js'
import { defaultDatasetResultState } from './state/defaultDatasetResult.js'
import { Estimator } from './types/estimators/Estimator.js'
import { estimatorState } from './state/estimators.js'
import { PrimarySpecificationConfig } from './types/experiments/PrimarySpecificationConfig.js'
import { CausalModelLevel } from './types/causality/CausalModelLevel.js'
import { EstimatorType } from './types/estimators/EstimatorType.js'
import { primarySpecificationConfigState } from './state/primarySpecificationConfig.js'
import { Definition } from './types/experiments/Definition.js'
import { definitionsState } from './state/definitions.js'
import { causalQuestionState } from './state/causalQuestion.js'
import { CausalQuestion } from './types/question/CausalQuestion.js'
import { selectedTableNameState } from './state/selectedDataPackage.js'
import { ModelExposurePage } from './pages/ModelExposurePage.js'
import { IContextualMenuItem } from '@fluentui/react'

const EXPOSURE_PROFILE = 'showwhy-model-exposure'

export class ExposureProfilePlugin implements ProfilePlugin<ExposureResource> {
	public readonly profile = EXPOSURE_PROFILE
	public readonly title = 'Model Exposure'
	public readonly iconName = 'TestBeaker'

	public renderer = ExposureAppRoot

	private _dataPackage: DataPackage | undefined

	public initialize(_api: AppServices, dataPackage: DataPackage) {
		this._dataPackage = dataPackage
	}

	public createResource() {
		return new ExposureResource()
	}

	public getCommandBarCommands(
		section: CommandBarSection,
	): IContextualMenuItem[] | undefined {
		const dp = this._dataPackage
		if (dp == null) {
			throw new Error('Data package not initialized')
		}
		if (section === CommandBarSection.New) {
			return [
				{
					key: this.profile,
					text: `New ${this.title}`,
					onClick: () => {
						const resource = this.createResource?.()
						resource.name = dp.suggestResourceName(resource.name)
						dp.addResource(resource)
					},
				},
			]
		}
	}
}

class ExposureResource extends Resource {
	public readonly $schema = ''
	public readonly profile = EXPOSURE_PROFILE

	public defaultName(): string {
		return 'Exposure Analysis'
	}

	public projectName: string = 'Exposure Analysis'
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
	public selectedTableName: string = ''

	public override toSchema() {
		return {
			...super.toSchema(),
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

	public override loadSchema(input: any) {
		super.loadSchema(input)
		this.projectName = input.projectName
		this.causalFactors = input.causalFactors
		this.defaultResult = input.defaultResult
		this.estimators = input.estimators
		this.primarySpecification = input.primarySpecification
		this.definitions = input.definitions
		this.question = input.question
		this.selectedTableName = input.selectedTableName
	}
}

const ExposureAppRoot: React.FC<{ resource: ExposureResource; href: string }> =
	memo(function ExposureAppRoot({ resource, href }) {
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
