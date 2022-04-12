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
				url: Pages.CausalQuestion,
				getMarkdown: async () =>
					import('../markdown/model-domain/DefineCausalQuestion.md?raw'),
			},
			{
				id: uuidv4(),
				title: 'Consider alternative definitions',
				status: StepStatus.ToDo,
				url: Pages.AlternativeDefinitions,
				getMarkdown: async () =>
					import(
						'../markdown/model-domain/ConsiderAlternativeDefinitions.md?raw'
					),
			},
			{
				id: uuidv4(),
				title: 'Consider relevant variables',
				status: StepStatus.ToDo,
				url: Pages.RelevantVariables,
				getMarkdown: async () =>
					import('../markdown/model-domain/RelevantVariables.md?raw'),
			},
			{
				id: uuidv4(),
				title: 'Consider variable relationships',
				status: StepStatus.ToDo,
				url: Pages.VariablesRelationships,
				getMarkdown: async () =>
					import(
						'../markdown/model-domain/ConsiderVariableRelationships.md?raw'
					),
			},
			{
				id: uuidv4(),
				title: 'Confirm domain models',
				status: StepStatus.ToDo,
				url: `${Pages.ConfirmDomain}`,
				getMarkdown: async () =>
					import('../markdown/model-domain/ConfirmDomainModels.md?raw'),
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
				getMarkdown: async () => import('../markdown/prepare-data/Load.md?raw'),
			},
			{
				id: uuidv4(),
				title: 'Derive data variables',
				status: StepStatus.ToDo,
				url: Pages.DeriveDataVariables,
				getMarkdown: async () =>
					import('../markdown/prepare-data/DeriveDataVariables.md?raw'),
			},
			// {
			// 	id: uuidv4(),
			// 	title: 'Confirm data',
			// 	status: StepStatus.ToDo,
			// 	url: Pages.ConfirmData,
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
				getMarkdown: async () =>
					import('../markdown/perform-analysis/Estimators.md?raw'),
			},
			{
				id: uuidv4(),
				title: 'Explore specification curve',
				status: StepStatus.ToDo,
				url: Pages.SpecificationCurvePage,
				getMarkdown: async () =>
					import('../markdown/perform-analysis/SpecificationCurve.md?raw'),
			},
			{
				id: uuidv4(),
				title: 'Evaluate hypothesis',
				status: StepStatus.ToDo,
				url: Pages.EvaluateHypothesisPage,
				getMarkdown: async () =>
					import('../markdown/perform-analysis/Hypothesis.md?raw'),
			},
		],
	},
] as StepList[]
