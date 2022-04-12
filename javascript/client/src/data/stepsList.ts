/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { v4 as uuidv4 } from 'uuid'

import type { StepList } from '~types'
import { Pages, StepStatus } from '~types'

export const stepsList = [
	{
		id: uuidv4(),
		name: 'Model domain',
		steps: [
			{
				id: uuidv4(),
				title: 'Define causal question',
				status: StepStatus.ToDo,
				url: Pages.DefineElements,
				showStatus: true,
				getMarkdown: async () =>
					import('../markdown/define-question/Elements.md?raw'),
			},
			{
				id: uuidv4(),
				title: 'Consider alternative definitions',
				status: StepStatus.ToDo,
				url: Pages.Alternative,
				showStatus: true,
				getMarkdown: async () =>
					import('../markdown/define-question/Population.md?raw'),
			},
			{
				id: uuidv4(),
				title: 'Consider relevant variables',
				status: StepStatus.ToDo,
				url: Pages.ConsiderCausalFactors,
				showStatus: true,
				getMarkdown: async () =>
					import(
						'../markdown/model-causal-factors/ConsiderCausalFactors.md?raw'
					),
			},
			{
				id: uuidv4(),
				title: 'Consider variable relationships',
				status: StepStatus.ToDo,
				showStatus: true,
				url: Pages.DefineFactors,
				getMarkdown: async () =>
					import('../markdown/model-causal-factors/CausingExposure.md?raw'),
			},
			{
				id: uuidv4(),
				title: 'Confirm domain models',
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
				title: 'Load data files',
				status: StepStatus.ToDo,
				url: `${Pages.LoadData}`,
				showStatus: true,
				getMarkdown: async () => import('../markdown/prepare-data/Load.md?raw'),
			},
			{
				id: uuidv4(),
				title: 'Derive data variables',
				status: StepStatus.ToDo,
				url: Pages.ProcessData,
				showStatus: true,
				getMarkdown: async () =>
					import('../markdown/prepare-data/Process.md?raw'),
			},
			// {
			// 	id: uuidv4(),
			// 	title: 'Confirm data',
			// 	status: StepStatus.ToDo,
			// 	url: Pages.ConfirmData,
			// 	showStatus: true,
			// 	getMarkdown: async () =>
			// 		import('../markdown/prepare-data/Confirm.md?raw'),
			// },
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
			// {
			// 	id: uuidv4(),
			// 	title: 'Estimate causal effects',
			// 	status: StepStatus.ToDo,
			// 	url: Pages.EstimateCausalEffects,
			// 	showStatus: true,
			// 	getMarkdown: async () =>
			// 		import('../markdown/perform-analysis/CausalEffects.md?raw'),
			// },
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
