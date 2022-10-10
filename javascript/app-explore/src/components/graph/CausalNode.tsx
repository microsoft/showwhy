/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Label, Stack } from '@fluentui/react'
import {
	CirclePlusIcon,
	StatusCircleErrorXIcon,
} from '@fluentui/react-icons-mdl2'
import isEqual from 'lodash-es/isEqual'
import { memo, useCallback } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { isAddable as isVariableAddable } from '../../domain/CausalVariable.jsx'
import {
	InModelCausalVariablesState,
	isVariableInModel,
} from '../../state/CausalGraphState.jsx'
import { SelectedObjectState } from '../../state/UIState.jsx'
import type { CausalNodeProps } from './CausalNode.types.js'

export const CausalNode: React.FC<CausalNodeProps> = memo(function CausalNode({
	variable,
	className,
	isSelectable = false,
	isAddable = false,
	isRemovable = false,
	center = false,
	wasDragged = false,
}) {
	const [, setSelectedObject] = useRecoilState(SelectedObjectState)
	const [inModelVariables, setInModelVariables] = useRecoilState(
		InModelCausalVariablesState,
	)
	const isInModel = useRecoilValue(isVariableInModel(variable.columnName))
	if (!isVariableAddable(variable)) {
		isAddable = false
	}

	const addToModel = () => {
		const newInModelVariables = [...inModelVariables, variable]
		setInModelVariables(newInModelVariables)
	}

	const removeFromModel = useCallback(() => {
		if (wasDragged) {
			return
		}
		const newInModelVariables = inModelVariables.filter(
			inModelVariable => !isEqual(inModelVariable, variable),
		)
		setInModelVariables(newInModelVariables)
	}, [wasDragged, inModelVariables, variable])

	const selectVariable = () => {
		if (isSelectable) {
			setSelectedObject(variable)
		}
	}

	return (
		<Stack className={className} grow horizontal tokens={{ childrenGap: 5 }}>
			<Stack.Item align="center" grow onClick={selectVariable}>
				<Label
					disabled={!isInModel}
					style={{
						textAlign: center ? 'center' : undefined,
					}}
				>
					{variable.name}
				</Label>
			</Stack.Item>
			{isAddable && !isInModel && (
				<Stack.Item align="center">
					<CirclePlusIcon onClick={addToModel} />
				</Stack.Item>
			)}
			{isRemovable && isInModel && (
				<Stack.Item align="center" onClick={removeFromModel}>
					<StatusCircleErrorXIcon />
				</Stack.Item>
			)}
		</Stack>
	)
})
