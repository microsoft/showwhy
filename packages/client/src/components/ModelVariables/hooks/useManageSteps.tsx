/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Step } from '@data-wrangling-components/core'
import { useBoolean } from '@fluentui/react-hooks'
import { useState, useCallback } from 'react'
import { useOnDuplicateStep, useOnEditStep } from './'

export function useManageSteps(onSave?: (step: Step, index?: number) => void): {
	step: Step | undefined
	onDismissColumnModal: () => void
	onDuplicateClicked: (step: Step) => void
	onEditClicked: (step: Step, index: number) => void
	onCreate: (step: Step, index?: number) => void
	showColumnModal: () => void
	isColumnModalOpen: boolean
} {
	const [step, setStep] = useState<Step>()
	const [stepIndex, setStepIndex] = useState<number>()
	const [
		isColumnModalOpen,
		{ setTrue: showColumnModal, setFalse: hideColumnModal },
	] = useBoolean(false)

	const onDismissColumnModal = useCallback(() => {
		hideColumnModal()
		setStep(undefined)
		setStepIndex(undefined)
	}, [setStep, setStepIndex, hideColumnModal])

	const onEditClicked = useOnEditStep(setStep, setStepIndex, showColumnModal)

	const onCreate = useCallback(
		(_step: Step) => {
			onSave && onSave(_step, stepIndex)
			onDismissColumnModal()
		},
		[onSave, onDismissColumnModal, stepIndex],
	)
	const onDuplicateClicked = () => console.log('ue')

	return {
		step,
		onDuplicateClicked,
		onDismissColumnModal,
		onEditClicked,
		onCreate,
		isColumnModalOpen,
		showColumnModal,
	}
}
