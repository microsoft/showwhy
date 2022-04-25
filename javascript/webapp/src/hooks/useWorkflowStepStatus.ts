/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Handler, Maybe, WorkflowStep } from '@showwhy/types'
import { StepStatus } from '@showwhy/types'

import { useSetStepStatus, useStepStatus } from '~state'

export function useWorkflowStepStatus(step: WorkflowStep): {
	stepStatus: Maybe<StepStatus>
	onToggleWorkflowStatus: Handler
} {
	const stepStatus = useStepStatus(step?.url)
	const setStepStatus = useSetStepStatus(step?.url)

	return {
		stepStatus,
		onToggleWorkflowStatus: () =>
			toggleWorkflowStatus(stepStatus, setStepStatus),
	}
}

function toggleWorkflowStatus(
	stepStatus: Maybe<StepStatus>,
	setStepStatus: (stepStatus: StepStatus) => void,
) {
	setStepStatus(
		stepStatus === StepStatus.Done ? StepStatus.ToDo : StepStatus.Done,
	)
}
