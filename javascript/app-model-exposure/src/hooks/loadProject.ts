/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable*/
import { DataPackageContext } from '@showwhy/app-common'
import { useCallback, useContext } from 'react'
import { useSetCausalFactors } from '../state/causalFactors.js'
import { useSetCausalQuestion } from '../state/causalQuestion.js'
import { useSetDefaultDatasetResult } from '../state/defaultDatasetResult.js'
import { useSetDefinitions } from '../state/definitions.js'
import { useSetEstimators } from '../state/estimators.js'
import { useSetPrimarySpecificationConfig } from '../state/primarySpecificationConfig.js'
import { useSetProjectJson } from '../state/projectJson.js'
import { useSetRunHistory } from '../state/runHistory.js'
import { useSetSelectedTableName } from '../state/selectedDataPackage.js'
import { useSetSignificanceTest } from '../state/significanceTests.js'
import { useSetSubjectIdentifier } from '../state/subjectIdentifier.js'
import type { CausalFactor } from '../types/causality/CausalFactor.js'
import type { Definition } from '../types/experiments/Definition.js'
import type { ZipFileData } from '../types/files/ZipFileData.js'
import { CausalQuestion } from '../types/question/CausalQuestion.js'
import type { RunHistory } from '../types/runs/RunHistory.js'
import type { ProjectJson } from '../types/workspace/ProjectJson.js'
import { withRandomId } from '../utils/ids.js'
import { useSetRunAsDefault } from './runHistory.js'

export function useLoadProject(): (project: ProjectJson) => Promise<void> {
	const setPrimarySpecificationConfig = useSetPrimarySpecificationConfig()
	const setCausalFactors = useSetCausalFactors()
	const setSubjectIdentifier = useSetSubjectIdentifier()
	const setDefinitions = useSetDefinitions()
	const setQuestion = useSetCausalQuestion()
	const setEstimators = useSetEstimators()
	const setDefaultDatasetResult = useSetDefaultDatasetResult()
	const updateRunHistory = useUpdateRunHistory()
	const setSignificanceTests = useSetSignificanceTest()
	const setProjectJson = useSetProjectJson()
	const setSelectedTableName = useSetSelectedTableName()
	const updateFileCollection = useUpdateFileCollection(setSelectedTableName)

	return useCallback(
		async (project: ProjectJson) => {
			// TODO: replace this
			const {
				results,
				runHistory = [],
				significanceTests = [],
			} = {} as ZipFileData

			const {
				primarySpecification,
				causalFactors,
				definitions,
				question,
				estimators,
				subjectIdentifier,
				defaultResult,
			} = project

			if (results && defaultResult) {
				defaultResult.url = results?.dataUri
			}

			// prep everything as needed to ensure partials from the JSON
			// have required fields
			const cfs = prepCausalFactors(causalFactors)
			const df = prepDefinitions(definitions)
			const est = estimators || []
			const defaultDatasetResult = defaultResult || null

			primarySpecification &&
				setPrimarySpecificationConfig(primarySpecification)

			setCausalFactors(cfs)
			setDefinitions(df)
			setQuestion(question || ({} as CausalQuestion))
			setEstimators(est)
			setSubjectIdentifier(subjectIdentifier)
			setDefaultDatasetResult(defaultDatasetResult)
			updateFileCollection(project)
			updateRunHistory(runHistory)
			setSignificanceTests(significanceTests)
			setProjectJson(project)
		},
		[
			setPrimarySpecificationConfig,
			setCausalFactors,
			setQuestion,
			setEstimators,
			setSubjectIdentifier,
			setDefaultDatasetResult,
			updateFileCollection,
			updateRunHistory,
			setProjectJson,
			setSignificanceTests,
			setDefinitions,
			setSelectedTableName,
		],
	)
}

function prepCausalFactors(
	factors: Partial<CausalFactor>[] = [],
): CausalFactor[] {
	return factors.map(withRandomId) as CausalFactor[]
}

function prepDefinitions(definitions: Definition[] = []): Definition[] {
	return definitions.map(withRandomId)
}

function useUpdateFileCollection(
	setSelectedTableName: (name: string) => void,
): (project: ProjectJson) => Promise<void> {
	const dp = useContext(DataPackageContext)

	return useCallback(
		async (project: ProjectJson) => {
			const files = new Map<string, Blob>()
			files.set(
				'datapackage.json',
				new Blob([JSON.stringify(project.datapackage)]),
			)
			dp.load(files)
				.then(() => setSelectedTableName(dp.tableStore.names[0]))
				.catch(err => console.error('error loading datapackage', err))
		},
		[dp],
	)
}

function useUpdateRunHistory() {
	const setRunHistory = useSetRunHistory()
	const setDefaultRun = useSetRunAsDefault()
	return useCallback(
		(runHistory: RunHistory[]) => {
			if (!runHistory.length) {
				return
			}
			setRunHistory(runHistory)
			const defaultRun = runHistory.find(run => run.isActive) || runHistory[0]!
			setDefaultRun(defaultRun)
		},
		[setRunHistory, setDefaultRun],
	)
}
