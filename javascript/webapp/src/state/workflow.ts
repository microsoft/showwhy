/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Workflow } from '@datashaper/core'
import type { Resetter, SetterOrUpdater } from 'recoil'
import {
	atom,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'

const workflowState = atom<Workflow>({
	key: 'workflow-store',
	default: new Workflow(),
})

export function useWorkflow(): Workflow {
	return useRecoilValue(workflowState)
}

export function useSetWorkflow(): SetterOrUpdater<Workflow> {
	return useSetRecoilState(workflowState)
}

export function useResetWorkflow(): Resetter {
	return useResetRecoilState(workflowState)
}

export function useWorkflowState(): [Workflow, SetterOrUpdater<Workflow>] {
	const workflow = useWorkflow()
	const setWorkflow = useSetWorkflow()
	return [workflow, setWorkflow]
}
