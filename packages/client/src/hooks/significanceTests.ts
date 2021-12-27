/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'
import { NodeResponseStatus } from '~enums'
import {
	NodeResponse,
	SignificanceTest,
	SignificanceTestResponse,
} from '~interfaces'
import { checkSignificanceStatus, executeNode } from '~resources'
import { buildSignificanceTestsNode } from '~resources/prepareDoWhyData'
import {
	useNodeResponse,
	useSetNodeResponse,
	useSetSignificanceTests,
} from '~state'
import { GenericFn } from '~types'
import { returnPercentage } from '~utils'

function useGetReady(
	runId: string,
): (
	res: Partial<SignificanceTestResponse>,
	significanceTests: SignificanceTest,
) => void {
	const updateSignificanceTests = useSetSignificanceTests(runId)

	return useCallback(
		async (res: Partial<SignificanceTestResponse>, significanceTests) => {
			if (
				res?.runtimeStatus?.toLowerCase() === NodeResponseStatus.Error ||
				res?.runtimeStatus?.toLowerCase() === NodeResponseStatus.Failed
			) {
				updateSignificanceTests({
					...significanceTests,
					status: res.runtimeStatus,
				})
				return
			}
			updateSignificanceTests({
				...significanceTests,
				simulation_completed: res.simulation_completed || 0,
				test_results: res.test_results,
				total_simulations: res.total_simulations || 0,
				status: res.runtimeStatus,
				percentage: returnPercentage(
					res?.simulation_completed || 0,
					res.total_simulations || 1,
				),
			})
		},
		[updateSignificanceTests],
	)
}

const useCheckRunStatus = (runId: string): GenericFn => {
	const ready = useGetReady(runId)
	const nodeResponse = useNodeResponse()
	return useCallback(async (significance: SignificanceTest, fn: GenericFn) => {
		const [response] = await Promise.all([
			checkSignificanceStatus(nodeResponse?.statusQueryGetUri as string),
		])
		ready(response, significance)
		if (
			response.runtimeStatus?.toLowerCase() === NodeResponseStatus.Pending ||
			response.runtimeStatus?.toLowerCase() === NodeResponseStatus.Running
		) {
			return fn(significance, fn)
		}
		return response
	}, [])
}

export function useSetInitialStatus(runId: string): () => SignificanceTest {
	const updateSignificanceTests = useSetSignificanceTests(runId)

	return useCallback(() => {
		const significanceObject = {
			runId,
			percentage: 0,
			total_simulations: 100,
			simulation_completed: 0,
			status: NodeResponseStatus.Pending,
			startTime: new Date(),
		}
		updateSignificanceTests(significanceObject)
		return significanceObject
	}, [updateSignificanceTests, runId])
}

export function useStartProcess(
	runId: string,
): (significanceObject: SignificanceTest, nodeResponse: NodeResponse) => void {
	const checkRunStatus = useCheckRunStatus(runId)
	const updateSignificanceTests = useSetSignificanceTests(runId)

	return useCallback(
		(significanceObject: SignificanceTest, nodeResponse: NodeResponse) => {
			const newObject = {
				...significanceObject,
				statusUrl: nodeResponse.statusQueryGetUri,
			}
			updateSignificanceTests(newObject)
			checkRunStatus(newObject, checkRunStatus)
		},
		[updateSignificanceTests, checkRunStatus],
	)
}

export function useRunSignificanceTests(
	runId: string,
): (taskIds: string[]) => void {
	const setNodeResponse = useSetNodeResponse()
	const startProcess = useStartProcess(runId)
	const setInitialStatus = useSetInitialStatus(runId)
	const updateSignificanceTests = useSetSignificanceTests(runId)
	return useCallback(
		async (taskIds: string[]) => {
			const significanceObject = setInitialStatus()
			try {
				const nodes = buildSignificanceTestsNode(taskIds)
				const nodeResponse = await executeNode(nodes)
				setNodeResponse(nodeResponse)
				startProcess(significanceObject, nodeResponse)
			} catch (error) {
				updateSignificanceTests({
					...significanceObject,
					status: NodeResponseStatus.Failed,
				})
			}
		},
		[runId, startProcess, setNodeResponse, setInitialStatus],
	)
}
