/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { v4 as uuidv4 } from 'uuid'
import {
	whyLinks,
	whoLinks,
	whenLinks,
	howLinks,
} from '../locales/en-US/understand-process'
import { PageType, Pages, StepList, StepStatus } from '~types'

export const stepsList = [
	{
		id: uuidv4(),
		name: 'Understand process',
		steps: [
			{
				id: uuidv4(),
				title: 'Why use ShowWhy?',
				resources: whyLinks.map(link => ({ ...link, id: uuidv4() })),
				status: StepStatus.ToDo,
				url: `${Pages.UnderstandProcess}/${PageType.Why}`,
				showStatus: false,
				getMarkdown: async () =>
					import('../markdown/understand-process/Why.md?raw'),
			},
			{
				id: uuidv4(),
				title: 'Who is ShowWhy for?',
				resources: whoLinks.map(link => ({ ...link, id: uuidv4() })),
				status: StepStatus.ToDo,
				url: `${Pages.UnderstandProcess}/${PageType.Who}`,
				showStatus: false,
				getMarkdown: async () =>
					import('../markdown/understand-process/Who.md?raw'),
			},
			{
				id: uuidv4(),
				title: 'When to use ShowWhy?',
				resources: whenLinks.map(link => ({ ...link, id: uuidv4() })),
				status: StepStatus.ToDo,
				url: `${Pages.UnderstandProcess}/${PageType.When}`,
				showStatus: false,
				getMarkdown: async () =>
					import('../markdown/understand-process/When.md?raw'),
			},
			{
				id: uuidv4(),
				title: 'How does ShowWhy work?',
				resources: howLinks.map(link => ({ ...link, id: uuidv4() })),
				status: StepStatus.ToDo,
				url: `${Pages.UnderstandProcess}/${PageType.How}`,
				showStatus: false,
				getMarkdown: async () =>
					import('../markdown/understand-process/How.md?raw'),
			},
		],
	},
	{
		id: uuidv4(),
		name: 'Define question',
		steps: [
			{
				id: uuidv4(),
				title: 'Describe elements',
				status: StepStatus.ToDo,
				url: `${Pages.DefineElements}`,
				showStatus: true,
				getMarkdown: async () =>
					import('../markdown/define-question/Elements.md?raw'),
			},
			{
				id: uuidv4(),
				title: 'Define population',
				status: StepStatus.ToDo,
				url: `${Pages.Define}/${PageType.Population}`,
				showStatus: true,
				getMarkdown: async () =>
					import('../markdown/define-question/Population.md?raw'),
			},
			{
				id: uuidv4(),
				title: 'Define exposure',
				status: StepStatus.ToDo,
				url: `${Pages.Define}/${PageType.Exposure}`,
				showStatus: true,
				getMarkdown: async () =>
					import('../markdown/define-question/Exposure.md?raw'),
			},
			{
				id: uuidv4(),
				title: 'Define outcome',
				status: StepStatus.ToDo,
				url: `${Pages.Define}/${PageType.Outcome}`,
				showStatus: true,
				getMarkdown: async () =>
					import('../markdown/define-question/Outcome.md?raw'),
			},
		],
	},
	{
		id: uuidv4(),
		name: 'Model causal factors',
		steps: [
			{
				id: uuidv4(),
				title: 'Consider causal factors',
				status: StepStatus.ToDo,
				url: `${Pages.ConsiderCausalFactors}`,
				showStatus: true,
				getMarkdown: async () =>
					import(
						'../markdown/model-causal-factors/ConsiderCausalFactors.md?raw'
					),
			},
			{
				id: uuidv4(),
				title: 'Factors causing exposure',
				status: StepStatus.ToDo,
				showStatus: true,
				url: `${Pages.DefineFactors}/${PageType.CauseExposure}`,
				getMarkdown: async () =>
					import('../markdown/model-causal-factors/CausingExposure.md?raw'),
			},
			{
				id: uuidv4(),
				title: 'Factors caused by exposure',
				status: StepStatus.ToDo,
				url: `${Pages.DefineFactors}/${PageType.CausedByExposure}`,
				showStatus: true,
				getMarkdown: async () =>
					import('../markdown/model-causal-factors/CausedByExposure.md?raw'),
			},
			{
				id: uuidv4(),
				title: 'Factors causing outcome',
				status: StepStatus.ToDo,
				url: `${Pages.DefineFactors}/${PageType.CauseOutcome}`,
				showStatus: true,
				getMarkdown: async () =>
					import('../markdown/model-causal-factors/CausingOutcome.md?raw'),
			},
			{
				id: uuidv4(),
				title: 'Factors caused by outcome',
				status: StepStatus.ToDo,
				url: `${Pages.DefineFactors}/${PageType.CausedByOutcome}`,
				showStatus: true,
				getMarkdown: async () =>
					import('../markdown/model-causal-factors/CausedByOutcome.md?raw'),
			},
			{
				id: uuidv4(),
				title: 'Confirm alternative models',
				status: StepStatus.ToDo,
				url: `${Pages.Confirm}`,
				showStatus: true,
				getMarkdown: async () =>
					import(
						'../markdown/model-causal-factors/ConfirmAlternativeModels.md?raw'
					),
			},
		],
	},
	{
		id: uuidv4(),
		name: 'Prepare data',
		steps: [
			{
				id: uuidv4(),
				title: 'Load data tables',
				status: StepStatus.ToDo,
				url: `${Pages.LoadData}`,
				showStatus: true,
				getMarkdown: async () => import('../markdown/prepare-data/Load.md?raw'),
			},
			{
				id: uuidv4(),
				title: 'Process table columns',
				status: StepStatus.ToDo,
				url: Pages.ProcessTableColumns,
				showStatus: true,
				getMarkdown: async () =>
					import('../markdown/prepare-data/Prepare.md?raw'),
			},
			{
				id: uuidv4(),
				title: 'Population variables',
				status: StepStatus.ToDo,
				url: `${Pages.Variables}/${PageType.Population}`,
				showStatus: true,
				getMarkdown: async () =>
					import('../markdown/prepare-data/PopulationVariables.md?raw'),
			},
			{
				id: uuidv4(),
				title: 'Exposure variables',
				status: StepStatus.ToDo,
				url: `${Pages.Variables}/${PageType.Exposure}`,
				showStatus: true,
				getMarkdown: async () =>
					import('../markdown/prepare-data/ExposureVariables.md?raw'),
			},
			{
				id: uuidv4(),
				title: 'Outcome variables',
				status: StepStatus.ToDo,
				url: `${Pages.Variables}/${PageType.Outcome}`,
				showStatus: true,
				getMarkdown: async () =>
					import('../markdown/prepare-data/OutcomeVariables.md?raw'),
			},
			{
				id: uuidv4(),
				title: 'Control variables',
				status: StepStatus.ToDo,
				url: `${Pages.Variables}/${PageType.Control}`,
				showStatus: true,
				getMarkdown: async () =>
					import('../markdown/prepare-data/ControlVariables.md?raw'),
			},
		],
	},
	{
		id: uuidv4(),
		name: 'Perform analysis',
		steps: [
			{
				id: uuidv4(),
				title: 'Select causal estimators',
				status: StepStatus.ToDo,
				url: Pages.SelectCausalEstimators,
				showStatus: true,
				getMarkdown: async () =>
					import('../markdown/perform-analysis/Estimators.md?raw'),
			},
			{
				id: uuidv4(),
				title: 'Estimate causal effects',
				status: StepStatus.ToDo,
				url: Pages.EstimateCausalEffects,
				showStatus: true,
				getMarkdown: async () =>
					import('../markdown/perform-analysis/CausalEffects.md?raw'),
			},
			{
				id: uuidv4(),
				title: 'Explore specification curve',
				status: StepStatus.ToDo,
				url: Pages.SpecificationCurvePage,
				showStatus: true,
				getMarkdown: async () =>
					import('../markdown/perform-analysis/SpecificationCurve.md?raw'),
			},
			{
				id: uuidv4(),
				title: 'Evaluate hypothesis',
				status: StepStatus.ToDo,
				url: Pages.EvaluateHypothesisPage,
				showStatus: true,
				getMarkdown: async () =>
					import('../markdown/perform-analysis/Hypothesis.md?raw'),
			},
		],
	},
] as StepList[]
