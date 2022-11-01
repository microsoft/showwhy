/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Label, Stack } from '@fluentui/react'
import isEqual from 'lodash-es/isEqual'
import { memo, useCallback } from 'react'
import { useRecoilState } from 'recoil'

import { isAddable as isVariableAddable } from '../../domain/CausalVariable.jsx'
import {
	InModelCausalVariablesState,
	SelectedObjectState,
} from '../../state/index.jsx'
import { IconButtonDark } from '../../styles/styles.js'
import { useIsVariableInModel } from './CausalNode.hooks.js'
import type { CausalNodeProps } from './CausalNode.types.js'

export const CausalNode: React.FC<CausalNodeProps> = memo(function CausalNode({
	variable,
	className,
	isSelectable = false,
	isAddable = false,
	isRemovable = false,
	center = false,
	wasDragged = false,
	style,
}) {
	const [, setSelectedObject] = useRecoilState(SelectedObjectState)
	const [inModelVariables, setInModelVariables] = useRecoilState(
		InModelCausalVariablesState,
	)
	const isInModel = useIsVariableInModel(variable.columnName)
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
	}, [wasDragged, inModelVariables, variable, setInModelVariables])

	const selectVariable = () => {
		if (isSelectable) {
			setSelectedObject(variable)
		}
	}

	return (
		<Stack
			className={className}
			horizontalAlign="space-between"
			verticalAlign="center"
			grow
			horizontal
			style={style}
		>
			<Stack.Item
				align="center"
				grow
				style={stackItemStyle}
				onClick={selectVariable}
			>
				<Label
					title={variable.name}
					disabled={!isInModel}
					style={{
						textAlign: center ? 'center' : undefined,
						...labelStyle,
					}}
				>
					{variable.name}
				</Label>
			</Stack.Item>
			{isAddable && !isInModel && (
				<Stack.Item align="center">
					<IconButtonDark onClick={addToModel} iconProps={icons.add} />
				</Stack.Item>
			)}
			{isRemovable && isInModel && (
				<Stack.Item align="center">
					<IconButtonDark onClick={removeFromModel} iconProps={icons.remove} />
				</Stack.Item>
			)}
		</Stack>
	)
})

const icons = {
	remove: { iconName: 'StatusCircleErrorX' },
	add: { iconName: 'circlePlus' },
}

const labelStyle = {
	overflow: 'hidden',
	whiteSpace: 'nowrap',
	textOverflow: 'ellipsis',
} as React.CSSProperties

const stackItemStyle = { width: '70%' }
