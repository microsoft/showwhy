/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { runPipeline, Step } from '@data-wrangling-components/core'
import { IContextualMenuItem } from '@fluentui/react'
import { useBoolean } from 'ahooks'
import { useCallback, useMemo } from 'react'
import { usePageType } from '~hooks'
import {
	useOutputTableModelVariables,
	useSetOutputTableModelVariables,
	useSubjectIdentifier,
} from '~state'
import { Maybe, TransformTable, VariableDefinition } from '~types'
import { useVariables } from './useVariables'
import { useViewTable } from './useViewTable'

// function useDeriveColumnCommand(
// 	onClick: (
// 		ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
// 		item?: IContextualMenuItem,
// 	) => boolean | void,
// 	selectedDefinitionId: string,
// ) {
// 	const cmd = useMemo(() => {
// 		return {
// 			key: 'derive-column',
// 			text: 'Create column',
// 			disabled: !selectedDefinitionId,
// 			iconProps: {
// 				iconName: 'Add',
// 			},
// 			onClick,
// 		}
// 	}, [onClick, selectedDefinitionId])
// 	return cmd
// }
// 857900000095 820400092103 222010993392 488900212447
// function useCommands(
// 	showModal: (
// 		ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
// 		item?: IContextualMenuItem,
// 	) => boolean | void,
// 	selectedDefinitionId: string,
// ) {
// 	const dccmd = useDeriveColumnCommand(showModal, selectedDefinitionId)
// 	return useMemo(() => [dccmd], [dccmd])
// }

export function useTableTransform(
	selectedDefinitionId: string,
): TransformTable {
	const pageType = usePageType()
	const [variables, setVariable] = useVariables(pageType)
	const outputTable = useOutputTableModelVariables()
	const setOutp = useSetOutputTableModelVariables()
	const subjectIdentifier = useSubjectIdentifier()

	const outputViewTable = useViewTable(
		selectedDefinitionId,
		variables,
		outputTable,
		subjectIdentifier,
	)

	const selectedVariable = useMemo((): Maybe<VariableDefinition> => {
		return variables.find(x => x.id === selectedDefinitionId)
	}, [variables, selectedDefinitionId])

	const handleTransformRequested = useCallback(
		async (step: Step) => {
			if (outputTable && step) {
				const output = await runPipeline(outputTable, [step])
				setOutp(output)
				setVariable({
					steps: [...variables.flatMap(x => x.steps), step],
					id: selectedDefinitionId, //TODO: change to definitionId?
				})
			}
		},
		[outputTable, variables, setVariable, setOutp, selectedDefinitionId],
	)

	const onDeleteStep = useCallback((index: number) => {}, [])

	return {
		// commands,
		// isModalOpen,
		// hideModal,
		outputViewTable,
		handleTransformRequested,
		selectedVariable,
		outputTable,
		onDeleteStep,
	}
}
