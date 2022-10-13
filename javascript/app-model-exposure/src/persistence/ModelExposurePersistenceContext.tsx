/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { JsonPersistable,useDataPackage } from '@showwhy/app-common'
import { memo, useCallback, useEffect, useMemo } from 'react'

import { useSetRunAsDefault } from '../hooks/runHistory.js'
import { useResetProject } from '../hooks/useResetProject.js'
import { useCausalFactors , useSetCausalFactors } from '../state/causalFactors.js'
import { useCausalQuestion , useSetCausalQuestion } from '../state/causalQuestion.js'
import { useDefaultDatasetResult , useSetDefaultDatasetResult } from '../state/defaultDatasetResult.js'
import { useDefinitions , useSetDefinitions } from '../state/definitions.js'
import { useEstimators , useSetEstimators } from '../state/estimators.js'
import { usePrimarySpecificationConfig , useSetPrimarySpecificationConfig } from '../state/primarySpecificationConfig.js'
import { useProjectName , useSetProjectName } from '../state/projectName.js'
import { useSetRunHistory } from '../state/runHistory.js'
import { useSelectedTableName , useSetSelectedTableName } from '../state/selectedDataPackage.js'
import { useSetSignificanceTest } from '../state/significanceTests.js'
import { useSetSubjectIdentifier } from '../state/subjectIdentifier.js'
import type { CausalFactor } from '../types/causality/CausalFactor.js'
import type { Definition } from '../types/experiments/Definition.js'
import type { CausalQuestion } from '../types/question/CausalQuestion.js'
import type { RunHistory } from '../types/runs/RunHistory.js'
import type { ProjectJson } from '../types/workspace/ProjectJson.js'
import { withRandomId } from '../utils/ids.js'

export const ModelExposurePersistenceProvider: React.FC = memo(
	function ModelExposurePersistenceProvider() {
		const dp = useDataPackage()
		const getProjectJson = useGetProjectJson()
		const loadProjectJson = useLoadProjectJson()

		const persistable = useMemo(
			() =>
				new JsonPersistable<ProjectJson>(
					'model-exposure-instance',
					'model-exposure',
					getProjectJson,
					loadProjectJson,
				),
			[getProjectJson, loadProjectJson],
		)

		useEffect(() => {
			dp.persistableStore.add(persistable)
			return () => dp.persistableStore.remove(persistable.name)
		}, [dp.persistableStore, persistable])

		// renderless component
		return null
	},
)

const EMPTY_DEFAULT = { url: '' }

function useGetProjectJson(): () => ProjectJson {
	const name = useProjectName()
	const causalFactors = useCausalFactors()
	const defaultResult = useDefaultDatasetResult() ?? EMPTY_DEFAULT
	const estimators = useEstimators()
	const primarySpecification = usePrimarySpecificationConfig()
	const definitions = useDefinitions()
	const question = useCausalQuestion()
	const selectedTableName = useSelectedTableName() ?? ''

	return useCallback(
		(): ProjectJson => ({
			name,
			causalFactors,
			defaultResult,
			estimators,
			primarySpecification,
			definitions,
			question,
			selectedTableName,
		}),
		[
			name,
			causalFactors,
			defaultResult,
			estimators,
			primarySpecification,
			definitions,
			question,
			selectedTableName,
		],
	)
}

function useLoadProjectJson(): (project: ProjectJson) => void {
	const setPrimarySpecificationConfig = useSetPrimarySpecificationConfig()
	const setCausalFactors = useSetCausalFactors()
	const setSubjectIdentifier = useSetSubjectIdentifier()
	const setDefinitions = useSetDefinitions()
	const setQuestion = useSetCausalQuestion()
	const setEstimators = useSetEstimators()
	const setDefaultDatasetResult = useSetDefaultDatasetResult()
	const updateRunHistory = useUpdateRunHistory()
	const setSignificanceTests = useSetSignificanceTest()
	const setSelectedTableName = useSetSelectedTableName()
	const setProjectName = useSetProjectName()
	const resetProject = useResetProject()

	return useCallback(
		(project: ProjectJson) => {
			resetProject()

			const {
				primarySpecification,
				causalFactors,
				definitions,
				question,
				estimators,
				subjectIdentifier,
				defaultResult,
				name,
				selectedTableName,
			} = project

			setProjectName(name)

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
			setSelectedTableName(selectedTableName)
			updateRunHistory([])
			setSignificanceTests([])
		},
		[
			setPrimarySpecificationConfig,
			setCausalFactors,
			setQuestion,
			setEstimators,
			setSubjectIdentifier,
			setDefaultDatasetResult,
			updateRunHistory,
			setSignificanceTests,
			setDefinitions,
			setSelectedTableName,
			resetProject,
			setProjectName,
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
