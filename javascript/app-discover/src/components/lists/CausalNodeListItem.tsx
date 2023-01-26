/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Stack } from '@fluentui/react'
import {
	BarChartVerticalIcon,
	BulletedListIcon,
	ChartIcon,
	ChildofIcon,
	CircleHalfFullIcon,
	NumberSequenceIcon,
} from '@fluentui/react-icons-mdl2'
import { memo } from 'react'

import { isDerived } from '../../domain/CausalVariable.js'
import { VariableNature } from '../../domain/VariableNature.js'
import { CausalNode } from '../graph/CausalNode.js'
import type { CausalNodeProps } from '../graph/CausalNode.types.js'
import { iconStyle, stackTokens } from './CausalNodeListItem.styles.js'

export const CausalNodeListItem: React.FC<CausalNodeProps> = memo(
	function CausalNodeListItem({ variable }) {
		return (
			<Stack horizontal key={variable.columnName} tokens={stackTokens}>
				{isDerived(variable) && (
					<Stack.Item align="center">
						<ChildofIcon style={iconStyle} />
					</Stack.Item>
				)}
				<Stack.Item align="center">
					{variable.nature === VariableNature.Continuous && <ChartIcon />}
					{variable.nature === VariableNature.Discrete && (
						<BarChartVerticalIcon />
					)}
					{variable.nature === VariableNature.CategoricalOrdinal && (
						<NumberSequenceIcon />
					)}
					{variable.nature === VariableNature.CategoricalNominal && (
						<BulletedListIcon />
					)}
					{variable.nature === VariableNature.Binary && <CircleHalfFullIcon />}
				</Stack.Item>
				<CausalNode variable={variable} isSelectable isAddable isRemovable />
			</Stack>
		)
	},
)
