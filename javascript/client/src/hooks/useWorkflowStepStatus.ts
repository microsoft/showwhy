/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Handler, Maybe } from '@showwhy/types'
import { useCallback } from 'react'

import { useSetStepStatus, useStepStatus } from '~state'
import type { WorkflowStep } from '~types'
import { StepStatus } from '~types'

export function useWorkflowStepStatus(step: WorkflowStep): {
	stepStatus: Maybe<StepStatus>
	onToggleWorkflowStatus: Handler
} {
	const stepStatus = useStepStatus(step?.url)
	const onToggleWorkflowStatus = useToggleWorkflowStatus(step, stepStatus)

	return {
		stepStatus,
		onToggleWorkflowStatus,
	}
}

function useToggleWorkflowStatus(
	step: Maybe<WorkflowStep>,
	stepStatus: Maybe<StepStatus>,
): Handler {
	const setStepStatus = useSetStepStatus(step?.url)
	return useCallback(() => {
		setStepStatus(
			stepStatus === StepStatus.Done ? StepStatus.ToDo : StepStatus.Done,
		)
	}, [setStepStatus, stepStatus])
}
