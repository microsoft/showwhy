/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import { SetBoolean, SetNodeResponse, SetRunHistory } from './types'
import { NodeResponseStatus, RefutationTypes } from '~enums'
import { useRefutationCount } from '~hooks'
import { NodeRequest, NodeResponse, ProjectFile, RunHistory } from '~interfaces'
import { executeNode, getSessionId } from '~resources'
import { useGetNodeProperties } from '~resources/hooks'
import {
	buildLoadNode,
	getGraph,
	sendFileUpload,
} from '~resources/prepareDoWhyData'
import { GenericFn, TypedFn } from '~types'

interface InitialStatusArgs {
	runHistory: RunHistory[]
	specCount?: number
	setRunHistory: SetRunHistory
	setRunAsDefault: GenericFn
	refutationType: RefutationTypes
}

interface SendDataArgs {
	projectFiles: ProjectFile[]
	estimateNode?: NodeRequest
	startProcess: GenericFn
	setCanceled: SetBoolean
	setNodeResponse: SetNodeResponse
	initialStatus: InitialStatusArgs
	confidenceInterval: boolean
}

const buildRun = (run: RunHistory, nodeResponse: NodeResponse): RunHistory => {
	return {
		...run,
		id: nodeResponse.id,
		isActive: false,
		statusUrl: nodeResponse.statusQueryGetUri,
		sessionId: getSessionId(),
	}
}

const useGetNodes = (
	projectFiles: ProjectFile[],
	estimateNode?: NodeRequest,
) => {
	return useCallback(
		(url: string, fileName: string): NodeRequest | undefined => {
			if (projectFiles.length && estimateNode) {
				const loadNode = buildLoadNode(url, fileName)
				return {
					nodes: [...loadNode.nodes, ...estimateNode.nodes],
				}
			}
			return undefined
		},
		[estimateNode, projectFiles],
	)
}

const useSetInitialStatus = ({
	runHistory,
	specCount,
	setRunHistory,
	setRunAsDefault,
	refutationType,
}: InitialStatusArgs): TypedFn<RunHistory> => {
	const totalRefuters = useRefutationCount()
	return useCallback(
		(hasConfidenceInterval: boolean) => {
			const run: RunHistory = {
				id: '0',
				runNumber: runHistory.length + 1,
				isActive: true,
				status: {
					status: NodeResponseStatus.Running,
					estimated_effect_completed: `0/${specCount}`,
					confidence_interval_completed: `0/${specCount}`,
					refute_completed: `0/${totalRefuters(specCount as number)}`,
					percentage: 0,
					time: {
						start: new Date(),
					},
				},
				hasConfidenceInterval,
				refutationType,
			}

			setRunHistory(
				prev =>
					[
						...prev.filter(p => p.runNumber !== run.runNumber),
						run,
					] as RunHistory[],
			)
			setRunAsDefault(run.id)
			return run
		},
		[runHistory, specCount, setRunHistory, setRunAsDefault],
	)
}

export const useSendData = ({
	projectFiles,
	estimateNode,
	startProcess,
	setCanceled,
	setNodeResponse,
	initialStatus,
	confidenceInterval,
}: SendDataArgs): GenericFn => {
	const getNodes = useGetNodes(projectFiles, estimateNode)
	const setInitialStatus = useSetInitialStatus(initialStatus)
	const getNodeProperties = useGetNodeProperties()
	return useCallback(async () => {
		setCanceled(false)
		const run = setInitialStatus(confidenceInterval)
		const [file] = projectFiles
		const fileUploaded = await sendFileUpload(projectFiles)
		const url = fileUploaded.uploaded_files[file.name]
		const additionalProperties = getNodeProperties(projectFiles[0].name)
		const graph = getGraph(url, file.name, additionalProperties)
		const nodes = getNodes(url, file.name)

		if (!nodes) return
		const nodesResponse = await executeNode(nodes)
		setNodeResponse(nodesResponse)
		startProcess(buildRun(run, nodesResponse), graph)
	}, [
		projectFiles,
		getNodes,
		setInitialStatus,
		startProcess,
		setCanceled,
		setNodeResponse,
		getNodeProperties,
	])
}
