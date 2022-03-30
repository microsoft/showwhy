/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Handler, Maybe } from '@showwhy/types'
import { useCallback } from 'react'

import { useSetStepStatus, useStepStatus } from '~state'
import type { WorkflowStep } from '~types'
import { StepStatus } from '~types'

export function useProcessStepStatus(step: WorkflowStep): {
	stepStatus: Maybe<StepStatus>
	onToggleStepStatus: Handler
} {
	const stepStatus = useStepStatus(step?.url)
	const onToggleStepStatus = useToggleStepStatus(step, stepStatus)

	return {
		stepStatus,
		onToggleStepStatus,
	}
}

function useToggleStepStatus(
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
